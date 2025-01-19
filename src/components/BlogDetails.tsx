import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { getAuth } from "firebase/auth";

const BlogDetails: React.FC = () => {
  const [blog, setBlog] = useState<any>(null);
  const [authorName, setAuthorName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { blogId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const fetchBlogDetails = async (blogId: string) => {
    try {
      console.log("Fetching blog with ID:", blogId);
      const blogRef = doc(firestore, "blogs", blogId);
      const blogSnapshot = await getDoc(blogRef);

      if (blogSnapshot.exists()) {
        console.log("Blog data:", blogSnapshot.data());
        const blogData = blogSnapshot.data();
        setBlog(blogData);

        if (blogData?.authorId) {
          const userRef = doc(firestore, "users", blogData.authorId);  // Assuming you store the author's ID in the blog document
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const combinedName = `${userData?.firstName || userData?.name} ${userData?.lastName || ""}`;
            setAuthorName(combinedName);  // Combine firstName and lastName
          } else {
            console.error("User not found!");
            setAuthorName("Unknown Author");
          }
        } else {
          console.error("Blog not found!");
          setAuthorName("Unknown Author");
        } 
      } else {
          console.error("Blog not found in Firestore!");
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false regardless of success or failure
      }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const blogRef = doc(firestore, "blogs", blogId as string);
        await deleteDoc(blogRef);
        alert("Blog deleted successfully!");
        navigate("/blog-list"); // Redirect to blogs list
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      if (blogId) {
        console.log("Fetching blog with ID:", blogId);
        setLoading(true);
        await fetchBlogDetails(blogId);
      } else {
        console.error("Blog ID is undefined!");
      }
    };
    
    fetchBlog();
  }, [blogId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-[95%] sm:max-w-2xl mx-auto min-h-screen">
      {blog ? (
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 border border-accent">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary mb-4">{blog.title}</h1>
          <p className="text-base sm:text-lg text-secondary leading-relaxed mt-2">{blog.content}</p>
          <p className="text-sm sm:text-base text-gray-500 mt-4">
            <span className="font-semibold text-primary">Author:</span>{" "}
              {authorName}
          </p>
          {/* Only show edit/delete buttons if the current user is the blog's owner */}
          {currentUser?.uid === blog.authorId && (
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => navigate(`/edit-blog/${blogId}`)}
                className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primaryDark"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg sm:text-xl text-gray-700">Blog not found.</p>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
