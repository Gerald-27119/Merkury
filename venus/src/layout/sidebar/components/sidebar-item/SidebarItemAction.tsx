import { logout } from "../../../../http/account";
import { notificationAction } from "../../../../redux/notification";
import { accountAction } from "../../../../redux/account";
import { SidebarAction } from "../../model/link";
import SidebarItemContent from "./SidebarItemContent";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { useNavigate } from "react-router-dom";

interface SidebarItemActionProps {
  link: SidebarAction;
  isSidebarOpen: boolean;
  showTooltip: () => void;
  hideTooltip: () => void;
  onChangeTheme: () => void;
  isTooltipShown: boolean;
}

export default function SidebarItemAction({
  link,
  showTooltip,
  hideTooltip,
  onChangeTheme,
  isSidebarOpen,
  isTooltipShown,
}: SidebarItemActionProps) {
  const dispatch = useDispatchTyped();
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
    } catch (error: any) {
      dispatch(
        notificationAction.setError({
          message: error?.message || "Logout failed!",
        }),
      );
    }
    navigate("/");
  };

  let clickHandler: (() => void) | undefined;
  switch (link.actionType) {
    case "login":
      clickHandler = handleSignOut;
      break;
    case "changeMode":
      clickHandler = onChangeTheme;
      break;
    default:
      clickHandler = () => {};
  }

  return (
    <button
      type="button"
      onClick={clickHandler}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      className={`mx-2 flex cursor-pointer items-center space-x-3 rounded-md pl-2 ${!isSidebarOpen && "hover:bg-violetLight mr-0 rounded-r-none transition-none"}`}
    >
      <SidebarItemContent
        isSidebarOpen={isSidebarOpen}
        isActive={false}
        link={link}
        isTooltipShown={isTooltipShown}
      />
    </button>
  );
}
