import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLogged = useSelector((state) => state.account.isLogged);

  return isLogged ? children : <Navigate to={"/"} />;
}
