import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./router.jsx";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;
import { accountAction } from "./redux/account.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logout } from "./http/account.js";

const queryClient = new QueryClient();

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(`${BASE_URL}/account/check`, {
          withCredentials: true,
        });
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
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
