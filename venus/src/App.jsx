import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./welcomePage/Welcome.jsx";
import Registration from "./account/components/Registration.jsx";
import Login from "./account/components/Login.jsx";
import Error from "./errors/Error.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Welcome />, errorElement: <Error /> },
  { path: "/registration", element: <Registration /> },
  { path: "/login", element: <Login /> },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
