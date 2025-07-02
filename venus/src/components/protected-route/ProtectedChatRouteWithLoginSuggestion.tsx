import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface Props {
    children: ReactNode;
}

export default function ProtectedRouteWithLoginSuggestion({ children }: Props) {
    const isLogged = useSelector((state: any) => state.account.isLogged);

    return isLogged ? children : <Navigate to={"/login"} />;
}
