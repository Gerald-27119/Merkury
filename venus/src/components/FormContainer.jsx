import OauthForm from "./oauth/OauthForm.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function FormContainer({
  isSuccess,
  error,
  header,
  navigateTo = "",
  linkCaption = "",
  showOauth = true,
  showLink = true,
  navigateOnSuccess = null,
  children,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && navigateOnSuccess) {
      navigate(navigateOnSuccess);
    }
  }, [isSuccess, navigate, navigateOnSuccess]);

  return (
    <div className="h-screen bg-[url('/bg-form.png')] bg-cover bg-no-repeat bg-center flex items-center justify-center w-screen">
      <div className="bg-amber-400 w-[30rem] rounded-md px-10 py-8 flex flex-col h-full justify-center">
        <h1 className="text-center text-2xl text-white font-bold pb-8">
          {header}
        </h1>
        {isSuccess && (
          <p className="text-center text-xl text-gray-600">Account created!</p>
        )}
        {error === 409 && (
          <p className="text-center text-xl text-red-600">
            E-mail or Username already taken.
          </p>
        )}
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
