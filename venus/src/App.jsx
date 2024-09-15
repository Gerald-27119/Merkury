import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WelcomePage from "./welcomePage/WelcomePage.jsx";
import Registration from "./account/components/Registration.jsx";
import Login from "./account/components/Login.jsx";
import Error from "./errors/Error.jsx";
import MainView from "./mainView/MainView.jsx";
import "./welcomePage/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  { path: "/temp", element: <MainView /> },
  { path: "/", element: <WelcomePage />, errorElement: <Error /> },
  { path: "/register", element: <Registration /> },
  { path: "/login", element: <Login /> },
]);

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
