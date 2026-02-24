import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RedirectToUserFeed() {
  const { userData, userToken } = useContext(AuthContext) || {};

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  const actualUser =
    userData?.user || userData?.data?.user || userData?.data || userData;

  if (actualUser?.name) {
    const slug = actualUser.name.replace(/\s+/g, "").toLowerCase();
    return <Navigate to={`/feed/${slug}`} replace />;
  }

  return null;
}
