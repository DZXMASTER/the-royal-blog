import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { getAuth } from "firebase/auth";

const EditBlog: React.FC = () => {
  const { blogId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const fetchBlogDetails = useCallback(async (blogId: string) => {
    try {
      const blogRef = doc(firestore, "blogs", blogId);
      const blogSnapshot = await getDoc(blogRef);

      if (blogSnapshot.exists()) {
        const blogData = blogSnapshot.data();

        // Check if the current user is the author
        if (blogData.authorId !== currentUser?.uid) {
          alert("You are not authorized to edit this blog!");
          navigate(`/blogs/${blogId}`); // Redirect back to the blog details
          return;
        }

        setTitle(blogData.title || "");
        setContent(blogData.content || "");
      } else {
        console.error("Blog not found!");
        navigate("/blogs"); // Redirect to blogs list
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    try {
      const blogRef = doc(firestore, "blogs", blogId as string);
      await updateDoc(blogRef, { title, content });
      alert("Blog updated successfully!");
      navigate(`/blog/${blogId}`); // Redirect to the blog details page
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  useEffect(() => {
    if (blogId) {
      setLoading(true);
      fetchBlogDetails(blogId);
    }
  }, [blogId, fetchBlogDetails]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-[95%] sm:max-w-2xl mx-auto min-h-screen">
      <form
        onSubmit={handleUpdate}
        className="bg-white shadow-lg rounded-lg p-6 sm:p-8 border border-accent"
      >
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary mb-6">
          Edit Blog
        </h1>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-primary font-semibold mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-primary font-semibold mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primaryDark transition-all"
          >
            Update Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
