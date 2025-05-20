import OauthForm from "../oauth/OauthForm";
import { Link, useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { notificationAction } from "../../redux/notification.jsx";
import useDispatchTyped from "../../hooks/useDispatchTyped";

interface FormContainerProps {
  isSuccess: boolean;
  error: any;
  header: string;
  navigateTo: string;
  linkCaption: string;
  showOauth: boolean;
  showLink: boolean;
  navigateOnSuccess: string | null;
  notificationMessage: string;
  children: ReactNode;
}

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
}: FormContainerProps) {
  const navigate = useNavigate();
  const dispatch = useDispatchTyped();

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
  }, [dispatch, isSuccess, notificationMessage]);

  return (
    <div className="dark:bg-darkBg bg-lightBg flex h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat">
      <div className="dark:bg-darkBgSoft bg-lightBgSoft mx-10 flex h-fit w-full flex-col justify-center rounded-md px-10 py-8 sm:mx-0 sm:w-[30rem]">
        <h1 className="dark:text-darkText text-lightText pb-8 text-center text-2xl font-bold text-shadow-md dark:text-shadow-white/20">
          {header}
        </h1>
        {children}
        {showOauth && (
          <>
            <div>
              <div className="inline-flex w-full items-center justify-center">
                <hr className="dark:bg-darkBorder bg-lightBgMuted my-8 h-px w-96 border-0" />
                <span className="dark:text-darkText dark:bg-darkBgSoft bg-lightBgSoft text-lightText absolute left-1/2 -translate-x-1/2 px-2 text-lg font-bold uppercase text-shadow-md dark:text-shadow-white/20">
                  or
                </span>
              </div>
            </div>
            <OauthForm />
          </>
        )}
        {showLink && (
          <Link
            to={navigateTo}
            className="dark:text-darkBorder text-lightText w-fit pt-8 text-sm text-shadow-md hover:underline dark:text-shadow-white/15"
          >
            {linkCaption}
          </Link>
        )}
      </div>
    </div>
  );
}
