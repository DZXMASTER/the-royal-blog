import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up a listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-primary p-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/blog-list" 
          className="text-3xl text-white font-serif font-bold"
          >
            Royal Blog
          </Link>
        <div className="relative" ref={menuRef}>
          <button
            className="block md:hidden text-white"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              console.log(isMenuOpen);
            }
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <ul className={`absolute md:static top-[100%] right-0 w-[150px] md:w-auto bg-primary md:bg-transparent shadow-lg md:shadow-none overflow-hidden transition-all duration-500 ease-in-out rounded-2xl text-center ${
              isMenuOpen ? "max-h-96" : "max-h-0"
            }`}
            style={{ 
              maxHeight: isMenuOpen ? "300px" : "0px",
              top: "calc(100% + 5vh)",
              right: "-2vw",
            }}>
              {user ? (
                <>
                  <Link 
                      to="/blog-list" 
                      className="text-xl text-white"
                    >
                    <li className="py-2 hover:bg-primaryDark">
                        Blogs
                    </li>
                  </Link>
                  <Link 
                      to="/add-edit-blog" 
                      className="text-xl text-white"
                    >
                    <li className="pb-2 hover:bg-primaryDark">
                      Add Blog
                    </li>
                  </Link>

                  <Link 
                      to="/profile" 
                      className="text-xl text-white"
                    >
                  <li className="pb-2 hover:bg-primaryDark">
                    Profile
                  </li>
                  </Link>
                  <li className="pb-2 hover:bg-primaryDark"
                      onClick={() => auth.signOut()}
                  >
                    <button
                      className="text-xl text-white w-full"
                    >
                      Logout
                    </button>
                  </li>
                </>
                ) : (
                  <li>
                    <Link to="/" className="text-xl text-white">
                      Login
                    </Link>
                  </li>
              )}
          </ul>
        </div>
      </div>
    </nav>
    
  );
};

export default Navbar;
