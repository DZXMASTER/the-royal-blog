import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = auth.currentUser;

  return user ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
