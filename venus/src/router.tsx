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
import MapPage from "./pages/map/MapPage";
import ChatsPage from "./pages/chats/ChatsPage";
import FavoriteSpots from "./pages/account/favorite-spots/FavoriteSpots";
import UserOwnProfile from "./pages/account/profile/UserOwnProfile";
import ProfileForViewer from "./pages/account/profile/ProfileForViewer";
import UserOwnSocial from "./pages/account/social/UserOwnSocial";
import SocialForViewer from "./pages/account/social/SocialForViewer";
import ProtectedRouteWithLoginRedirect from "./components/protected-route/ProtectedChatRouteWithLoginSuggestion";

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
                                <UserOwnProfile />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "profile/:username",
                        element: <ProfileForViewer />,
                    },
                    {
                        path: "favorite-spots",
                        element: (
                            <ProtectedRoute>
                                <FavoriteSpots />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "friends",
                        element: (
                            <ProtectedRoute>
                                <UserOwnSocial />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "friends/:username",
                        element: <SocialForViewer />,
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
                path: "map",
                element: <MapPage />,
            },
            {
                path: "chat",
                element: (
                    <ProtectedRouteWithLoginRedirect>
                        <ChatsPage />
                    </ProtectedRouteWithLoginRedirect>
                ),
            },
        ],
    },
]);

export default router;
