import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import BlogList from "./pages/BlogList";
import AddEditBlog from "./pages/AddEditBlog";
import BlogDetails from "./components/BlogDetails";
import EditBlog from "./pages/EditBlog";
import Footer from "./components/Footer";
import { auth } from "./firebaseConfig";
import ProtectedRoute from "./components/ProtectedRoute";
import { onAuthStateChanged } from "firebase/auth";

const App: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); //Rehydration is complete
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      {user && <Navbar />} {/* Only shows Navbar if the user is logged in */}
      <div className="bg-parchment bg-cover bg-center min-h-screen">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/blog-list" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
          <Route path="/add-edit-blog" element={<ProtectedRoute><AddEditBlog /></ProtectedRoute>} />
          <Route path="/blog/:blogId" element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} />
          <Route path="/edit-blog/:blogId" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
