import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ReactElement, useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { logout } from "../../../http/account";
import { notificationAction } from "../../../redux/notification";
import { accountAction } from "../../../redux/account";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useToggleState } from "../../../hooks/useToggleState";

interface Link {
  to: string;
  icon: ReactElement;
  name: string;
  type?: string;
}

interface SidebarItemProps {
  link: Link & {
    children?: Link[];
  };
  isSidebarOpen: boolean;
  onChangeTheme?: () => void;
  isChildren?: boolean;
  onClick?: () => void;
  index?: number;
}

export default function SidebarItem({
  link: { to, icon, name, children, type },
  isSidebarOpen,
  onChangeTheme,
  isChildren,
  onClick,
  index,
}: SidebarItemProps) {
  const [isOpen, toggleSubmenu] = useToggleState(false);

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
      // setIsOpen(false);
    }
  }, [location.pathname, to]);

  // const handleOpen = () => {
  //   setIsOpen((prevState) => !prevState);
  //   if (onClick) onClick();
  // };

  const content = (isActive: boolean): ReactElement => (
    <>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center text-3xl`}
      >
        {icon}
      </div>
      <p
        className={`flex min-w-[10rem] items-center text-start text-base font-semibold capitalize transition-opacity duration-300 ${!isSidebarOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        {name}
        {children?.length > 0 &&
          (isOpen ? (
            <IoIosArrowUp className="ml-2" />
          ) : (
            <IoIosArrowDown className="ml-2" />
          ))}
        {!isChildren && isActive && <GoDotFill className="ml-2" />}
      </p>
    </>
  );

  if (!to) {
    let clickHandler: (() => void) | undefined;

    if (type === "login") {
      clickHandler = handleSignOut;
    } else if (type === "changeMode") {
      clickHandler = onChangeTheme;
    } else if (type === "account") {
      clickHandler = toggleSubmenu;
    }

    return (
      <div
        className={`group overflow-hidden transition-all duration-500 ${index === 0 && "mt-2"}`}
      >
        <button
          type="button"
          onClick={clickHandler}
          className="flex w-full cursor-pointer items-center space-x-3 rounded-md pl-2 transition-all"
        >
          {content(false)}
        </button>
        <div
          className={`space-y-1 overflow-hidden transition-all duration-500 ${isOpen ? "max-h-96" : "max-h-0"} ${!isSidebarOpen && "group-hover:max-h-96"}`}
        >
          {children?.map((link, index) => (
            <SidebarItem
              key={link.name}
              link={link}
              isSidebarOpen={isSidebarOpen}
              isChildren={true}
              onClick={toggleSubmenu}
              index={index}
            />
          ))}
        </div>
      </div>
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
          `flex items-center rounded-md transition-all ${isChildren ? "hover:bg-violetLight space-x-1" : "space-x-3"} ${isActive && isChildren && "bg-violetLight"} ${isChildren ? "text-darkBorder pl-5" : "pl-2"}`
        }
        onClick={toggleSubmenu}
      >
        {({ isActive }) => content(isActive)}
      </NavLink>
      <div
        className={`space-y-1 overflow-hidden transition-all duration-500 ${isOpen ? "max-h-96" : "max-h-0"} ${!isSidebarOpen && "group-hover:max-h-96"}`}
      >
        {children?.map((link, index) => (
          <SidebarItem
            key={link.name}
            link={link}
            isSidebarOpen={isSidebarOpen}
            isChildren={true}
            onClick={toggleSubmenu}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
