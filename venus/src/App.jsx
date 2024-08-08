import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./welcomePage/Welcome.jsx";
import Registration from "./account/components/Registration.jsx";
import Login from "./account/components/Login.jsx";
import Error from "./errors/Error.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  { path: "/", element: <Welcome />, errorElement: <Error /> },
  { path: "/registration", element: <Registration /> },
  { path: "/login", element: <Login /> },
]);

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}

export default App;
