import { createBrowserRouter, Navigate } from "react-router-dom";
import Error from "./components/error/Error.jsx";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/forgot-password/ForgotPassword.jsx";
import NewPassword from "./pages/new-password/NewPassword.jsx";
import Layout from "./layout/Layout.jsx";
import Forum from "./pages/forum/Forum";
import ProtectedRoute from "./components/protected-route/ProtectedRoute.jsx";
import EditUserData from "./pages/edit-user-data/EditUserData.jsx";
import FavouriteSpots from "./pages/favourite-spots/FavouriteSpots.jsx";
import MapPage from "./pages/map/MapPage";
import Profile from "./pages/account/profile/Profile";
import ChatsPage from "./pages/chats/ChatsPage";
import Social from "./pages/account/social/Social";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error error={undefined} />,
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
            children: [{ path: ":id", element: <Profile /> }],
          },
          {
            path: "friends",
            element: (
              <ProtectedRoute>
                <Social />
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
        element: <Forum />,
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
