import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFound from "../pages/NotFound";

// Get the base URL from Vite's environment
const baseUrl = import.meta.env.BASE_URL;
import Profile from "../pages/profile/Profile";
import UsersPage from "../pages/users/Users";
import Services from "../pages/users/services";
import City from "../pages/city/City";
import GeoFences from "../pages/geofences/GeoFences";
import PrivacyPolicy from "../pages/privacyPolicy/PrivacyPolicy";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter(
  [
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "user-management",
          element: <UsersPage />,
        },
        {
          path: "venue",
          element: <Services />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "city",
          element: <City />,
        },
        {
          path: "geo-fences",
          element: <GeoFences />,
        },
        {
          path: "privacy-policy",
          element: <PrivacyPolicy />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    basename: baseUrl // Use the base URL from Vite's environment
  });

