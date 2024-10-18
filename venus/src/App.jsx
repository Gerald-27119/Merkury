import { RouterProvider } from "react-router-dom";
import "./welcomePage/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./router/router-config.jsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
