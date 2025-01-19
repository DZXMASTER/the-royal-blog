import React, { useEffect, useState } from "react";
import { getAllBlogPosts/*, deleteBlogPost*/ } from "../services/blogService";
import { Link } from "react-router-dom";

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getAllBlogPosts();
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

  /*const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await deleteBlogPost(id);
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    }
  };*/

    return (
        <div className="p-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif text-primary mb-4">The Royal Blog</h1>
            <p className="text-xl text-secondary">Where knowledge and wisdom are etched in time.</p>
          </div>
    
          <div className="grid md:grid-cols-2 gap-10">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white shadow-lg p-6 rounded-xl border-2 border-accent"
              >
                <h2 className="text-3xl font-serif text-primary">{blog.title}</h2>
                <p className="mt-4 text-xl text-secondary">{blog.content.substring(0, 100)}...</p>
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-accent font-semibold mt-6 inline-block"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </div>
      );
};

export default BlogList;
