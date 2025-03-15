import { createBrowserRouter } from "react-router-dom";
import Error from "./components/error/Error.jsx";
import MainPage from "./pages/main-page/MainPage.jsx";
import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";
import ForgotPassword from "./pages/forgot-password/ForgotPassword.jsx";
import NewPassword from "./pages/new-password/NewPassword.jsx";
import Account from "./pages/account/Account.jsx";
import Layout from "./layout/Layout.jsx";
import Forum from "./pages/forum/Forum.jsx";
import ProtectedRoute from "./components/protected-route/ProtectedRoute.jsx";
import EditUserData from "./pages/edit-user-data/EditUserData.jsx";
import FavouriteSpots from "./pages/favourite-spots/FavouriteSpots.jsx";
import SpotMapViewer from "./pages/map/SpotMapViewer.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/map",
        element: <SpotMapViewer />,
      },
      {
        path: "account",
        element: <Account />,
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
    ],
  },
]);

export default router;
