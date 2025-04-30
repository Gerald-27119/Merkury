import { createBrowserRouter, Navigate } from "react-router-dom";
import Error from "./components/error/Error.jsx";
import MapPage from "./pages/welcome/WelcomePage.jsx";
import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";
import ForgotPassword from "./pages/forgot-password/ForgotPassword.jsx";
import NewPassword from "./pages/new-password/NewPassword.jsx";
import Layout from "./layout/Layout.jsx";
import Forum from "./pages/forum/Forum.jsx";
import ProtectedRoute from "./components/protected-route/ProtectedRoute.jsx";
import EditUserData from "./pages/edit-user-data/EditUserData.jsx";
import FavouriteSpots from "./pages/favourite-spots/FavouriteSpots.jsx";
import Profile from "./pages/account/profile/Profile.tsx";
import ChatsPage from "./pages/chats/ChatsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <h1>HOME PAGE</h1>,
      },
      {
        path: "account",
        children: [
          {
            index: true,
            element: <Navigate to="profile" replace />,
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "new-password",
        element: <NewPassword />,
      },
      {
        path: "forum",
        element: (
          <ProtectedRoute>
            <Forum />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-data",
        element: (
          <ProtectedRoute>
            <EditUserData />
          </ProtectedRoute>
        ),
      },
      {
        path: "favourite-spots",
        element: (
          <ProtectedRoute>
            <FavouriteSpots />
          </ProtectedRoute>
        ),
      },
      {
        path: "map",
        element: <MapPage />,
      },
      {
        path: "chat",
        element: (
          // for demo purposes only
          // <ProtectedRoute>
          <ChatsPage />
          // </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
