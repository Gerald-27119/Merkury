import { useDispatch } from "react-redux";
import { accountAction } from "../../redux/account.jsx";
import { Link, Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function JwtError({ error }) {
  const dispatch = useDispatch();
  let message = "Could not find page or resource.";

  useEffect(() => {
    if (error?.response?.status === 401) {
      dispatch(accountAction.signOut());
    }
  }, [error, dispatch]);

  if (error?.response?.status === 401) {
    return <Navigate to="/" />;
  }

  if (error?.response?.message) {
    message = error?.response?.message;
  }

  return (
    <div className="my-4">
      <h1 className="text-red-600 text-4xl font-bold text-center m-4">
        Error occurred!
      </h1>
      {error?.response?.status && (
        <p className="text-center text-xl text-yellow-400">
          Status code: {error?.response?.status}
        </p>
      )}
      <p className="text-yellow-400 text-center text-xl m-4">{message}</p>
      <div className="text-center">
        <Link
          to="/"
          className="bg-amber-200 rounded p-1 text-center hover:bg-amber-300"
        >
          Return to the main page
        </Link>
      </div>
    </div>
  );
}
