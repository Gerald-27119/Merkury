import { createBrowserRouter } from "react-router-dom";
import Error from "../errors/Error.jsx";
import WelcomePage from "../welcomePage/WelcomePage.jsx";
import MainView from "../mainView/MainView.jsx";
import Registration from "../account/components/Registration.jsx";
import Login from "../account/components/Login.jsx";
import ForgotPassword from "../account/components/ForgotPassword.jsx";
import NewPassword from "../account/components/newPassword.jsx";
import Map from "../map/Map.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      { index: true, element: <WelcomePage /> },
      {
        path: "main-view",
        element: <MainView />,
        children: [
          {
            index: true,
            element: <Map />,
          },
        ],
      },
      { path: "register", element: <Registration /> },
      { path: "login", element: <Login /> },
      { path: "/login/forgot-password", element: <ForgotPassword /> },
      { path: "/login/new-password", element: <NewPassword /> },
    ],
  },
]);

export default router;
