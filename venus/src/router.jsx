import {createBrowserRouter} from "react-router-dom";
import Error from "./components/error/Error.jsx";
import WelcomePage from "./pages/welcome/WelcomePage.jsx";
import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";
import ForgotPassword from "./pages/forgot-password/ForgotPassword.jsx";
import NewPassword from "./pages/forgot-password/NewPassword.jsx";
import Account from "./pages/account/Account.jsx";
import Layout from "./layout/Layout.jsx";
import MetodaWytwarzaniaOprogramowania from "./retro/slajdy/MetodaZarządzaniaProjetkem.jsx";
import RetroLayout from "./retro/RetroLayout.jsx";
import Architektura from "./retro/slajdy/Architektura.jsx";
import Zadania from "./retro/slajdy/Zadania.jsx";
import Reszta from "./retro/slajdy/Reszta.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        errorElement: <Error/>,
        children: [
            {
                index: true,
                element: <WelcomePage/>,
            },
            {
                path: "account",
                element: <Account/>,
            },
            {
                path: "register",
                element: <Register/>,
            },
            {
                path: "login",
                element: <Login/>,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>,
            },
            {
                path: "new-password",
                element: <NewPassword/>,
            },
        ],
    },
    {
        path: "/retro1",
        element: <RetroLayout/>,
        children: [
            {
                index: true,
                element: <MetodaWytwarzaniaOprogramowania/>,
            },
            {
                path: "architektura",
                element: <Architektura/>,
            },
            {
                path: "zadania",
                element: <Zadania/>,
            },            {
                path: "reszta",
                element: <Reszta/>,
            },
        ],
    }
]);

export default router;
