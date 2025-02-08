import Button from "./Button.jsx";
import { logout } from "../../http/account.js";
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
    <Button
      classNames={
        "px-1.5 bg-gradient-to-r from-purple-500  to-teal-500 hover:to-purple-600  hover:from-teal-600 duration-600 justify-center rounded text-center align-middle leading-normal text-fuchsia-50 transition-all delay-200 ease-in-out"
      }
      onClick={handleSignOut}
    >
      Sign out
    </Button>
  );
}
