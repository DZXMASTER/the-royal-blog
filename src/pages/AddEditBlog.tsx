import React, { useState } from "react";
import { addBlogPost } from "../services/blogService";
import { auth } from "../firebaseConfig";

const AddEditBlog: React.FC = () => {
  const [formData, setFormData] = useState({ title: '', content: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.currentUser) {
      addBlogPost(formData.title, formData.content, auth.currentUser.uid);
      setFormData(prevFormData => ({ ...prevFormData, title: "", content: ""}));
      alert("Blog added successfully!");
    } else {
      alert("You must be logged in to add a blog.");
    }
  };

  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl p-8 rounded-xl border-2 border-accent">
        <h2 className="text-4xl font-serif text-primary mb-6">Create a New Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xl text-primary" htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-2 w-full p-3 border-2 border-accent rounded-lg text-secondary bg-light-gray"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-xl text-primary" htmlFor="content">Content</label>
            <textarea
              name="content"
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mt-2 w-full p-3 border-2 border-accent rounded-lg text-secondary bg-light-gray"
              rows={6}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white text-xl font-serif rounded-md"
          >
            Save Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditBlog;
