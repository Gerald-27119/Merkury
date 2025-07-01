import { Link, Navigate, useRouteError } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { notificationAction } from "../../redux/notification.jsx";

export default function Error({ error }) {
    const dispatch = useDispatch();
    const routeError = useRouteError();
    let message = "Could not find page or resource.";

    useEffect(() => {
        if (error?.response?.status !== 404) {
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

    if (routeError.message) {
        message = routeError.message;
    }
    return (
        <>
            <h1 className="m-4 text-center text-4xl font-bold text-red-600">
                Error occurred!
            </h1>
            {routeError.status && (
                <p className="text-center text-xl text-yellow-400">
                    Status code: {routeError.status}
                </p>
            )}
            <p className="m-4 text-center text-xl text-yellow-400">{message}</p>
            <div className="text-center">
                <Link
                    to="/"
                    className="rounded-sm bg-amber-200 p-1 text-center hover:bg-amber-300"
                >
                    Return to the main page
                </Link>
            </div>
        </>
    );
}
