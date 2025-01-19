import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
//import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const editProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    //const storageRef = ref(storage, `profilePictures/${user?.uid}/${file.name}`);

    if (!user || !user.uid) {
      alert("User is not logged in or UID is unavailable.");
      return;
    }
  
    const userDocRef = doc(db, "users", user.uid);

    try {
      setUploading(true);
      //await uploadBytes(storageRef, file);

      //const downloadURL = await getDownloadURL(storageRef);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;

        await updateDoc(userDocRef, { photoURL: base64Image });

        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: base64Image });
          setUser({ ...auth.currentUser, photoURL: base64Image });
          alert("Profile picture updated successfully!");
        }
      }
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Failed to upload image.");
      };
  
      reader.readAsDataURL(file); 
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture.");
    } finally {
      setUploading(false);
      console.log(uploading);
      console.log(auth.currentUser);
    }
  
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        console.error("User is not authenticated.");
        navigate("/");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-lg mx-auto bg-white shadow-2xl p-6 sm:p-8 rounded-xl border-2 border-accent">
        <h1 className="text-3xl sm:text-4xl font-serif text-primary mb-4 sm:mb-6">Profile</h1>
        
        {user ? (
          <div className="text-lg sm:text-xl text-secondary">
            <div className="mb-3 sm:mb-4">
              <strong className="block text-primary mb-1 sm:mb-2">Name:</strong> 
              <p className="truncate">{user.displayName || "No Name Provided"}</p>
            </div>
            <div className="mb-3 sm:mb-4">
              <strong className="block text-primary mb-1 sm:mb-2">Email:</strong> 
              <p className="truncate">{user.email}</p>
            </div>
            <div className="mb-4 sm:mb-6">
              <strong className="block text-primary mb-2 sm:mb-3">Profile Picture:</strong>
              <div className="flex justify-center">
                <img
                  src={user.photoURL || "https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg"}
                  alt="Profile"
                  className="mt-4 rounded-lg shadow-xl w-32 h-32 object-cover text-center mx-auto"
                />
              </div>
            </div>
            <div className="flex justify-center mt-4 sm:mt-6">
            <label
              htmlFor="profile-upload"
              className={`cursor-pointer inline-block text-white py-3 px-4 sm:py-3 sm:px-6 rounded-lg shadow mx-auto w-full bg-primary ${
                uploading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-primaryDark"
              } text-xl font-serif transition-all duration-300 text-center max-w-xs sm:text-lg`}
            >
              {uploading ? "Uploading..." : "Change Profile Picture"}
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploading ? undefined : editProfile}
            />
            </div>
          </div>
        ) : (
          <p className="text-lg sm:text-xl text-secondary text-center">You are not logged in.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
