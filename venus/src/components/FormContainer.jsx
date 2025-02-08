import OauthForm from "./oauth/OauthForm.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { notificationAction } from "../redux/notification.jsx";

const errorMessages = {
  409: "E-mail or Username already taken.",
  401: "Invalid credentials",
};

export default function FormContainer({
  isSuccess,
  error,
  header,
  navigateTo = "",
  linkCaption = "",
  showOauth = false,
  showLink = false,
  navigateOnSuccess = null,
  notificationMessage,
  children,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && navigateOnSuccess) {
      navigate(navigateOnSuccess);
    }
  }, [isSuccess, navigate, navigateOnSuccess]);

  useEffect(() => {
    if (error) {
      const message = errorMessages[error.response?.status] || error.message;
      dispatch(
        notificationAction.setError({
          message: message || "Error occurred!",
        }),
      );
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        notificationAction.setSuccess({
          message: notificationMessage || "Success!",
        }),
      );
    }
  }, [dispatch, header, isSuccess, notificationMessage]);

  return (
    <div className="h-screen bg-[url('/bg-form.png')] bg-cover bg-no-repeat bg-center flex items-center justify-center w-screen">
      <div className="bg-amber-400 w-[30rem] rounded-md px-10 py-8 flex flex-col h-full justify-center">
        <h1 className="text-center text-2xl text-white font-bold pb-8">
          {header}
        </h1>
        {children}
        {showOauth && (
            <div>
              <div className="inline-flex items-center justify-center w-full">
                <hr className="w-96 h-px my-8 bg-white border-0" />
                <span className="uppercase text-lg -translate-x-1/2 absolute bg-amber-400 left-1/2 px-2 font-bold text-white">
                  or
                </span>
              </div>
            </div>
          ) && <OauthForm />}
        {showLink && (
          <Link
            to={navigateTo}
            className="text-sm hover:underline pt-8 text-gray-600"
          >
            {linkCaption}
          </Link>
        )}
      </div>
    </div>
  );
}
