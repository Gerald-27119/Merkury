import { RouterProvider } from "react-router-dom";
import "./pages/account/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./router.jsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
