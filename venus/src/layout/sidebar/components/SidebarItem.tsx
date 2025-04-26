import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ReactElement, useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { logout } from "../../../http/account";
import { notificationAction } from "../../../redux/notification";
import { accountAction } from "../../../redux/account";
import useDispatchTyped from "../../../hooks/useDispatchTyped";

interface Link {
  to: string;
  icon: ReactElement;
  name: string;
}

interface SidebarItemProps {
  link: Link & {
    children?: Link[];
  };
  isSidebarOpen: boolean;
  onChangeTheme?: () => void;
  isMiddlePart?: boolean;
  onClick?: () => void;
  index?: number;
}

export default function SidebarItem({
  link: { to, icon, name, children },
  isSidebarOpen,
  onChangeTheme,
  isMiddlePart,
  onClick,
  index,
}: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
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

  useEffect(() => {
    if (location.pathname !== to) {
      setIsOpen(false);
    }
  }, [location.pathname, to]);

  const handleOpen = () => {
    setIsOpen(true);
    if (onClick) onClick();
  };

  const content = (isActive: boolean): ReactElement => (
    <>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center ${isMiddlePart ? "text-2xl" : "text-3xl"}`}
      >
        {icon}
      </div>
      <p
        className={`flex min-w-[10rem] items-center text-start text-base font-semibold capitalize transition-opacity duration-300 ${!isSidebarOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        {name}
        {!isMiddlePart && isActive && <GoDotFill className="ml-2" />}
      </p>
    </>
  );

  if (!to) {
    let clickHandler: (() => void) | undefined;

    if (name === "sign out") {
      clickHandler = handleSignOut;
    } else if (name !== "notification") {
      clickHandler = onChangeTheme;
    }

    return (
      <button
        type="button"
        onClick={clickHandler}
        className="flex w-full cursor-pointer items-center space-x-4 rounded-md pl-2 transition-all"
      >
        {content(false)}
      </button>
    );
  }

  return (
    <div
      className={`group overflow-hidden transition-all duration-500 ${index === 0 && "mt-2"}`}
    >
      <NavLink
        to={to}
        end
        className={({ isActive }) =>
          `flex items-center rounded-md transition-all ${isMiddlePart ? "hover:bg-violetLight space-x-1" : "space-x-3"} ${isActive && isMiddlePart && "bg-violetLight"} ${isMiddlePart ? "pl-12" : "pl-2"}`
        }
        onClick={handleOpen}
      >
        {({ isActive }) => content(isActive)}
      </NavLink>
      <div
        className={`space-y-1 overflow-hidden transition-all duration-500 group-hover:max-h-96 ${isOpen ? "max-h-96" : "max-h-0"}`}
      >
        {children?.map((link, index) => (
          <SidebarItem
            key={link.name}
            link={link}
            isSidebarOpen={isSidebarOpen}
            isMiddlePart={true}
            onClick={handleOpen}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
