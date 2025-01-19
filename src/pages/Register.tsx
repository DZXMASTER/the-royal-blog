import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update user profile
      await updateProfile(user, { displayName: firstName + " " + lastName });

      // Add user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        photoURL: user.photoURL || "",
        uid: user.uid,
      });

      console.log("User registered:", user);
      navigate("/blog-list");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Open the Google sign-in popup
      const result = await signInWithPopup(auth, provider);

      // Get the signed-in user
      const user = result.user;

      // Add user information to Firestore (optional)
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });

      console.log("User signed up:", user);
      // Redirect to the dashboard or home page after registration
      navigate("/blog-list");
    } catch (error) {
      console.error("Error during Google sign-up:", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-6 sm:p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-center text-3xl font-bold font-serif text-primary mb-6">Register</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-primary font-medium mb-2 font-serif">
               First Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 rounded-md border-2 border-accent font-serif"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-primary font-medium mb-2 font-serif">
              Last Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 rounded-md border-2 border-accent font-serif"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-primary font-medium mb-2 font-serif">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-md border-2 border-accent font-serif"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-primary font-medium mb-2 font-serif">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-md border-2 border-accent font-serif"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary hover:bg-primaryDark text-white font-serif rounded-md"
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={handleGoogleSignUp}
          className="flex items-center justify-center w-full bg-[#808590] text-white py-2 rounded-md hover:bg-[#6D6E70] transition-colors shadow-md font-serif my-2"
        >
          <svg className="max-h-5 max-w-5 mr-3" viewBox="0 0 48 48">
            <clipPath id="g">
              <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
            </clipPath>
            <g className="colors" clipPath="url(#g)">
              <path fill="#FBBC05" d="M0 37V11l17 13z"/>
              <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
              <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
              <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
            </g>
          </svg>
          Sign up with Google
        </button>
        <p className="text-center text-primary mt-4 font-serif">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-white bg-primary hover:bg-primaryDark p-2 text-lg font-serif rounded-md m-2"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
