import { Link, Navigate, useRouteError } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { accountAction } from "../../redux/account.jsx";
import { notificationAction } from "../../redux/notification.jsx";

export default function Error({ error }) {
  const dispatch = useDispatch();
  const routeError = useRouteError();
  let message = "Could not find page or resource.";

  useEffect(() => {
    if (error?.response?.status !== 404) {
      dispatch(accountAction.signOut());
      dispatch(
        notificationAction.setError({
          message: error?.response?.data,
        }),
      );
    }
  }, [error, dispatch]);

  if (error?.response?.status === 401) {
    return <Navigate to="/" />;
  }

  if (routeError?.message) {
    message = routeError.message;
  }
  return (
    <>
      <h1 className="text-red-600 text-4xl font-bold text-center m-4">
        Error occurred!
      </h1>
      {routeError?.status && (
        <p className="text-center text-xl text-yellow-400">
          Status code: {routeError?.status}
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
    </>
  );
}
