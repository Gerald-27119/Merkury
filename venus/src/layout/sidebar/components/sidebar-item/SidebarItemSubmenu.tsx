import SidebarItemSubmenuLink from "./SidebarItemSubmenuLink";
import React, { useEffect, useState } from "react";
import { useToggleState } from "../../../../hooks/useToggleState";
import SidebarItemContent from "./SidebarItemContent";
import { SidebarSubmenu } from "../../model/link";

interface SidebarItemSubmenuProps {
  link: SidebarSubmenu;
  isSidebarOpen: boolean;
  openSubmenu: string | null;
  setOpenSubmenu: (name: string | null) => void;
  index: number;
  showTooltip: () => void;
  hideTooltip: () => void;
  isTooltipShown: boolean;
}

export default function SidebarItemSubmenu({
  openSubmenu,
  setOpenSubmenu,
  index,
  isSidebarOpen,
  link,
  showTooltip,
  hideTooltip,
  isTooltipShown,
}: SidebarItemSubmenuProps) {
  const [isOpen, setIsOpenSubmenu, toggleSubmenu] = useToggleState(false);
  const [isDot, setIsDot] = useState(false);

  useEffect(() => {
    if (openSubmenu !== link.name && isOpen) {
      toggleSubmenu();
    }
  }, [openSubmenu]);

  useEffect(() => {
    let foundSubmenu: string | null = null;
    let found = false;

    for (const child of link.children || []) {
      if (child.to === location.pathname) {
        foundSubmenu = link.name;
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

  const handleOpenSubmenu = () => {
    if (setOpenSubmenu) {
      setOpenSubmenu(isOpen ? null : link.name);
    }
    toggleSubmenu();
  };

  return (
    <div
      className={`mx-2 transition-all duration-500 ${index === 0 && "mt-2"} ${!isSidebarOpen && "mr-0"}`}
    >
      <button
        type="button"
        onClick={handleOpenSubmenu}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className={`flex w-full cursor-pointer items-center space-x-3 rounded-md pl-2 ${!isSidebarOpen && "hover:bg-violetLight rounded-r-none transition-none"}`}
      >
        <SidebarItemContent
          isSidebarOpen={isSidebarOpen}
          isActive={false}
          link={link}
          isDot={isDot}
          isOpen={isOpen}
          isTooltipShown={isTooltipShown}
        />
      </button>
      <div
        className={`space-y-1 overflow-hidden transition-all duration-500 ${isOpen && isSidebarOpen ? "max-h-96" : "max-h-0"}`}
      >
        {link.children?.map((link) => (
          <SidebarItemSubmenuLink key={link.name} link={link} />
        ))}
      </div>
    </div>
  );
}
