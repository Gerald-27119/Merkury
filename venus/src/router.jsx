import { createBrowserRouter } from "react-router-dom";
import Error from "./components/error/Error.jsx";
import WelcomePage from "./pages/welcome/WelcomePage.jsx";
import Registration from "./pages/register/Registration.jsx";
import Login from "./pages/login/Login.jsx";
import ForgotPassword from "./pages/forgot-password/ForgotPassword.jsx";
import NewPassword from "./pages/forgot-password/NewPassword.jsx";
import Account from "./pages/account/Account.jsx";
import Layout from "./layout/Layout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "register",
        element: <Registration />,
      },
      {
        path: "login",
        element: <Login />,
        children: [
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "new-password",
            element: <NewPassword />,
          },
        ],
      },
    ],
  },
]);

export default router;
