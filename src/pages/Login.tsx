import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any existing error messages

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/blog-list"); // Redirect to "blog-list" page
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", err.message);
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });
      console.log("User logged in:", result.user);
      navigate("/blog-list");
    } catch (error) {
      console.error("Error during login:", error);
      await signInWithRedirect(auth, provider);
    }
  };

  return (
    <div className="p-10">
      <div className="max-w-lg mx-auto bg-white shadow-2xl p-8 rounded-xl border-2 border-accent">
        <h2 className="text-3xl font-serif text-primary mb-6 text-center">Login to the Royal Blog</h2>
        <div className="mt-6">
          <form>
            <div className="mb-4">
              <label className="block text-xl text-primary font-serif" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-2 w-full p-3 border-2 border-accent rounded-lg text-secondary font-serif"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl text-primary font-serif" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-2 w-full p-3 border-2 border-accent rounded-lg text-secondary font-serif"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              onClick={handleLogin}
              className="w-full py-3 bg-primary hover:bg-primaryDark text-white text-xl font-serif rounded-md mt-4"
            >
              Login
            </button>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full bg-[#808590] text-white text-xl py-2 rounded-md hover:bg-[#6D6E70] transition-colors shadow-md font-serif my-2"
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
              Sign in with Google
            </button>
            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primaryDark text-white text-xl font-serif rounded-md"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
