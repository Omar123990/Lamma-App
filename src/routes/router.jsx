import { createBrowserRouter, Navigate } from "react-router-dom";
import { useContext } from "react";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Profile from "../pages/Profile";

import SavedPosts from "../pages/SavedPosts";
import Notifications from "../pages/Notifications";

import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "../context/AuthContext";
import NotFound from "../pages/NotFound";

const RedirectToUserFeed = () => {
  const context = useContext(AuthContext);

  if (!context) return null;

  const { userData } = context;

  if (!userData) return null;

  if (userData?.name) {
    const slug = userData.name.replace(/\s+/g, "").toLowerCase();
    return <Navigate to={`/feed/${slug}`} replace />;
  }

  return <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <RedirectToUserFeed />,
          },
          {
            path: "feed/:username",
            element: <Home />,
          },
          {
            path: "profile/:id",
            element: <Profile />,
          },
          {
            path: "saved",
            element: <SavedPosts />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
