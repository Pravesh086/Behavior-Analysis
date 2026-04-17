import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/student/profile" replace />;
  }

  return children;
};

export { PublicRoute };
