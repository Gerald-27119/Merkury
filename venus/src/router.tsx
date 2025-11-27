import { createBrowserRouter, Navigate } from "react-router-dom";
import Error from "./components/error/Error.jsx";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/forgot-password/ForgotPassword.jsx";
import NewPassword from "./pages/new-password/NewPassword.jsx";
import Layout from "./layout/Layout.jsx";
import Forum from "./pages/forum/Forum";
import ForumThread from "./pages/forum/ForumThread";
import ProtectedRoute from "./components/protected-route/ProtectedRoute.jsx";
import MapPage from "./pages/map/MapPage";
import ChatsPage from "./pages/chats/ChatsPage";
import FavoriteSpots from "./pages/account/favorite-spots/FavoriteSpots";
import UserOwnProfile from "./pages/account/profile/UserOwnProfile";
import ProfileForViewer from "./pages/account/profile/ProfileForViewer";
import Comments from "./pages/account/comments/Comments";
import UserOwnSocial from "./pages/account/social/UserOwnSocial";
import SocialForViewer from "./pages/account/social/SocialForViewer";
import Photos from "./pages/account/photos/Photos";
import Settings from "./pages/account/settings/Settings";
import HomePage from "./pages/home-page/HomePage";
import Movies from "./pages/account/movies/Movies";
import AdvanceHomePage from "./pages/home-page/AdvanceHomePage";
import AddedSpot from "./pages/account/add-spot/AddedSpot";
import ForumSearch from "./pages/forum/post-search/ForumSearch";
import PostTagsPage from "./pages/forum/categories-and-tags/components/PostTagsPage";
import PostCategoriesPage from "./pages/forum/categories-and-tags/components/PostCategoriesPage";
import ForumLayout from "./pages/forum/ForumLayout";
import ForumLayoutRoute from "./layout/forum/ForumLayoutRoute";
import ForumHistory from "./pages/forum/ForumHistory";
import ForumFollowed from "./pages/forum/ForumFollowed";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <Error error={undefined} />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "advanced",
                element: <AdvanceHomePage />,
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
                    {
                        path: "photos",
                        element: (
                            <ProtectedRoute>
                                <Photos />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "comments",
                        element: (
                            <ProtectedRoute>
                                <Comments />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "settings",
                        element: (
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "movies",
                        element: (
                            <ProtectedRoute>
                                <Movies />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "add-spot",
                        element: (
                            <ProtectedRoute>
                                <AddedSpot />
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
                element: <ForumLayoutRoute />,
                children: [
                    {
                        index: true,
                        element: <Forum />,
                    },
                    {
                        path: ":postId/:slugTitle?",
                        element: <ForumThread />,
                    },
                    {
                        path: "search",
                        element: <ForumSearch />,
                    },
                    {
                        path: "categories",
                        element: <PostCategoriesPage />,
                    },
                    {
                        path: "tags",
                        element: <PostTagsPage />,
                    },
                    {
                        path: "followed",
                        element: (
                            <ProtectedRoute>
                                <ForumFollowed />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
            {
                path: "map",
                element: <MapPage />,
            },
            {
                path: "chat",
                element: (
                    <ProtectedRoute>
                        <ChatsPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default router;
