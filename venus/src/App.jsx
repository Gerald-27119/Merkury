import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./router.jsx";
import axios from "axios";
import BASE_URL from "./http/baseUrl.js";
import { accountAction } from "./redux/account.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(BASE_URL, {
          withCredentials: true,
        });
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(accountAction.signOut());
        }
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
