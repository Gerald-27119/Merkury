import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./router.tsx";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;
import { accountAction } from "./redux/account";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logout } from "./http/account.js";
import "maplibre-gl/dist/maplibre-gl.css";
import { WebSocketProvider } from "./stomp/WebSocketContext.tsx";

const queryClient = new QueryClient();

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = (await axios.get(`${BASE_URL}/account/check`, {
                    withCredentials: true,
                })).data;
                dispatch(accountAction.setUsername(username))
            } catch (error) {
                if (error.response?.status === 401) {
                    await logout();
                    dispatch(accountAction.signOut());
                }
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (localStorage.getItem("theme") === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <WebSocketProvider>
                <RouterProvider router={router} />
            </WebSocketProvider>
        </QueryClientProvider>
    );
}

export default App;
