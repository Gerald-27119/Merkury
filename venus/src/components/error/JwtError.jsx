import { useDispatch } from "react-redux";
import { accountAction } from "../../redux/account.jsx";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function JwtError({ error }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (error?.response?.status === 401) {
      dispatch(accountAction.signOut());
    }
  }, [error, dispatch]);

  if (error?.response?.status === 401) {
    return <Navigate to={"/"} />;
  }

  return null;
}
