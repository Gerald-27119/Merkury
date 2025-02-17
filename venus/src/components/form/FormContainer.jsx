import OauthForm from "../oauth/OauthForm.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { notificationAction } from "../../redux/notification.jsx";

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
      dispatch(
        notificationAction.setError({
          message: error?.response?.data,
        }),
      );
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        notificationAction.setSuccess({
          message: notificationMessage,
        }),
      );
    }
  }, [dispatch, header, isSuccess, notificationMessage]);

  return (
    <div className="h-screen dark:bg-darkBg bg-lightBg bg-cover bg-no-repeat bg-center flex items-center justify-center w-screen">
      <div className="dark:bg-darkBgSoft bg-lightBgSoft w-[30rem] rounded-md px-10 py-8 flex flex-col h-full justify-center">
        <h1 className="text-center text-2xl dark:text-darkText text-lightText font-bold pb-8">
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
            className="text-sm hover:underline pt-8 dark:text-darkText text-lightText"
          >
            {linkCaption}
          </Link>
        )}
      </div>
    </div>
  );
}
