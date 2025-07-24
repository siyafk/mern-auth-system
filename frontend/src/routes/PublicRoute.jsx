// components/PublicRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/Context";

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useContext(UserContext);

  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;