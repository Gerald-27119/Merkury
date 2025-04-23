import { logout } from "../../http/account.ts";
import { useDispatch } from "react-redux";
import { accountAction } from "../../redux/account.jsx";
import { notificationAction } from "../../redux/notification.jsx";
import { useNavigate } from "react-router-dom";

export default function SignOutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      dispatch(
        notificationAction.setSuccess({
          message: "You have been successfully logged out",
        }),
      );
      dispatch(accountAction.signOut());
    } catch (error) {
      dispatch(
        notificationAction.setError({
          message: error?.message || "Logout failed!",
        }),
      );
    }
    navigate("/");
  };

  return (
    <button
      className={
        "justify-center rounded-sm bg-linear-to-r from-purple-500 to-teal-500 px-1.5 text-center align-middle leading-normal text-fuchsia-50 transition-all delay-200 duration-600 ease-in-out hover:from-teal-600 hover:to-purple-600"
      }
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
