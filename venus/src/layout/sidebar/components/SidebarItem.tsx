import { NavLink, useLocation, useNavigate } from "react-router-dom";
import React, { ReactElement, useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { logout } from "../../../http/account";
import { notificationAction } from "../../../redux/notification";
import { accountAction } from "../../../redux/account";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useToggleState } from "../../../hooks/useToggleState";

export interface Link {
  to?: string;
  icon?: React.ReactElement;
  name: string;
  type?: string;
  children?: Link[];
}

interface SidebarItemProps {
  link: Link;
  isSidebarOpen: boolean;
  onChangeTheme?: () => void;
  isChildren?: boolean;
  index?: number;
  openSubmenu?: string | null;
  setOpenSubmenu?: (name: string | null) => void;
}

export default function SidebarItem({
  link: { to, icon, name, children, type },
  isSidebarOpen,
  onChangeTheme,
  isChildren,
  index,
  openSubmenu,
  setOpenSubmenu,
}: SidebarItemProps) {
  const [isOpen, setIsOpenSubmenu, toggleSubmenu] = useToggleState(false);
  const [isDot, setIsDot] = useState(false);

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
    if (openSubmenu !== name && isOpen) {
      toggleSubmenu();
    }
  }, [openSubmenu]);

  useEffect(() => {
    let foundSubmenu: string | null = null;
    let found = false;

    for (const child of children || []) {
      if (child.to === location.pathname) {
        foundSubmenu = name;
        found = true;
        break;
      }
    }

    setIsDot(found);

    if (setOpenSubmenu && foundSubmenu) {
      setOpenSubmenu(foundSubmenu);
      setIsOpenSubmenu(true);
    }
  }, [location.pathname]);

  const content = (isActive: boolean): ReactElement => (
    <>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center text-3xl`}
      >
        {icon}
      </div>
      <p
        className={`flex min-w-[10rem] items-center text-start font-semibold capitalize transition-opacity duration-300 ${!isSidebarOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        {name}
        {children &&
          children?.length > 0 &&
          (isOpen ? (
            <IoIosArrowUp className="ml-2" />
          ) : (
            <IoIosArrowDown className="ml-2" />
          ))}
        {!isChildren && (isActive || isDot) && <GoDotFill className="ml-2" />}
      </p>
      {!isSidebarOpen && (
        <div className="text-darkText bg-violetLight absolute top-0 left-full rounded-r-md px-2.5 py-2 whitespace-nowrap capitalize opacity-0 duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
          <div className="flex flex-col text-start">
            <p className="font-semibold">{name}</p>
            {children?.map((link) => (
              <NavLink
                key={link.name}
                to={link.to ?? ""}
                className="text-darkBorder"
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );

  if (!to) {
    let clickHandler: (() => void) | undefined;

    if (type === "login") {
      clickHandler = handleSignOut;
    } else if (type === "changeMode") {
      clickHandler = onChangeTheme;
    } else if (type === "submenu") {
      clickHandler = () => {
        if (setOpenSubmenu) {
          setOpenSubmenu(isOpen ? null : name);
        }
        toggleSubmenu();
      };
    }

    return (
      <div
        className={`transition-all duration-500 ${index === 0 && "mt-2"} mx-2 ${!isSidebarOpen && "mr-0"}`}
      >
        <button
          type="button"
          onClick={clickHandler}
          className={`group relative flex w-full cursor-pointer items-center space-x-3 rounded-md pl-2 transition-all ${!isSidebarOpen && "hover:bg-violetLight rounded-r-none"}`}
        >
          {content(false)}
        </button>
        <div
          className={`space-y-1 overflow-hidden transition-all duration-500 ${isOpen && isSidebarOpen ? "max-h-96" : "max-h-0"}`}
        >
          {children?.map((link, index) => (
            <SidebarItem
              key={link.name}
              link={link}
              isSidebarOpen={isSidebarOpen}
              isChildren={true}
              index={index}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `group relative mx-2 flex items-center rounded-md transition-all ${isChildren ? "hover:bg-violetLight text-darkBorder space-x-1 pl-5" : "space-x-3 pl-2"} ${isActive && isChildren && "bg-violetLight"} ${!isSidebarOpen && "hover:bg-violetLight rounded-r-none"}`
      }
    >
      {({ isActive }) => content(isActive)}
    </NavLink>
  );
}
