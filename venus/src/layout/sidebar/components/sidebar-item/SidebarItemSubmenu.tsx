import { useToggleState } from "../../../../hooks/useToggleState";
import React, { ReactElement, useEffect, useState } from "react";
import { useBoolean } from "../../../../hooks/useBoolean";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { logout } from "../../../../http/account";
import { notificationAction } from "../../../../redux/notification";
import { accountAction } from "../../../../redux/account";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GoDotFill } from "react-icons/go";

export default function SidebarItemSubmenu() {
  const [isOpen, setIsOpenSubmenu, toggleSubmenu] = useToggleState(false);
  const [isDot, setIsDot] = useState(false);
  const [isTooltipShown, showTooltip, hideTooltip] = useBoolean(false);

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
    <div className="flex items-center">
      <div
        className={`relative flex shrink-0 items-center justify-center text-3xl ${isChildren ? "h-10 w-5" : "h-10 w-10"}`}
      >
        <div>
          {!isSidebarOpen && to ? <NavLink to={to}>{icon}</NavLink> : icon}

          {!isSidebarOpen && isTooltipShown && (
            <div className="bg-violetLight text-darkText absolute top-0 left-full z-50 ml-3.5 rounded-r-md px-3 py-2 text-start text-base font-semibold whitespace-nowrap capitalize">
              <p
                className={`${children?.length ? "cursor-auto" : "cursor-pointer"}`}
              >
                {name}
              </p>
              {children?.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to!}
                  className="block font-normal text-gray-300"
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <p className="ml-2 flex min-w-[10rem] items-center text-start font-semibold capitalize">
          {name}
          {children?.length &&
            (isOpen ? (
              <IoIosArrowUp className="ml-2" />
            ) : (
              <IoIosArrowDown className="ml-2" />
            ))}
          {!isChildren && (isActive || isDot) && <GoDotFill className="ml-2" />}
        </p>
      )}
    </div>
  );

  if (!to || children?.length) {
    let clickHandler: (() => void) | undefined;
    switch (type) {
      case "login":
        clickHandler = handleSignOut;
        break;
      case "changeMode":
        clickHandler = onChangeTheme;
        break;
      default:
        clickHandler = () => {
          if (setOpenSubmenu) {
            setOpenSubmenu(isOpen ? null : name);
          }
          toggleSubmenu();
        };
    }

    return (
      <div
        className={`mx-2 transition-all duration-500 ${index === 0 && "mt-2"} ${!isSidebarOpen && "mr-0"}`}
      >
        <button
          type="button"
          onClick={clickHandler}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          className={`flex w-full cursor-pointer items-center space-x-3 rounded-md pl-2 transition-all ${!isSidebarOpen && "hover:bg-violetLight rounded-r-none transition-none"}`}
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
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      className={({ isActive }) =>
        `mx-2 flex items-center rounded-md transition-all ${isChildren ? "hover:bg-violetLight space-x-1 pl-5 text-gray-300" : "space-x-3 pl-2"} ${isActive && isChildren && "bg-violetLight"} ${!isSidebarOpen && "hover:bg-violetLight mr-0 rounded-r-none transition-none"}`
      }
    >
      {({ isActive }) => content(isActive)}
    </NavLink>
  );
}
