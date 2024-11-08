import { Link, useRouteError } from "react-router-dom";

export default function Error() {
  let message = "Could not find page or resource.";
  const error = useRouteError();

  if (error.message) {
    message = error.message;
  }
  return (
    <>
      <h1 className="text-red-600 text-4xl font-bold text-center m-4">
        Error occurred!
      </h1>
      {error.status && (
        <p className="text-center text-xl text-yellow-400">
          Status code: {error.status}
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
