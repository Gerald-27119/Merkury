import SidebarItemSubmenuLink from "./SidebarItemSubmenuLink";
import React, { useEffect, useState } from "react";
import { useToggleState } from "../../../../hooks/useToggleState";
import SidebarItemContent from "./SidebarItemContent";
import { SidebarSubmenu } from "../../model/link";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  useEffect(() => {
    if (openSubmenu !== link.name && isOpen) {
      toggleSubmenu();
    }
  }, [openSubmenu]);

  useEffect(() => {
    const hasActiveChild =
      link.children?.some((child) => child.to === location.pathname) ?? false;

    setIsDot(hasActiveChild);

    if (hasActiveChild) {
      setOpenSubmenu(link.name);
      setIsOpenSubmenu(true);
    } else if (openSubmenu === link.name) {
      setOpenSubmenu(null);
      setIsOpenSubmenu(false);
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
        className={`flex w-full cursor-pointer items-center space-x-3 rounded-md pl-2 ${!isSidebarOpen && "hover:bg-violetLight rounded-r-none"}`}
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
      <AnimatePresence initial={false}>
        {isOpen && isSidebarOpen && (
          <motion.div
            key="submenu"
            initial={{ opacity: 0, height: 0, x: -8 }}
            animate={{ opacity: 1, height: "auto", x: 0 }}
            exit={{ opacity: 0, height: 0, x: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-1 overflow-hidden"
          >
            {link.children?.map((link) => (
              <SidebarItemSubmenuLink key={link.name} link={link} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
