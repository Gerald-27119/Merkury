import SidebarItemSubmenuLink from "./SidebarItemSubmenuLink";
import React, { useEffect, useState } from "react";
import { useToggleState } from "../../../../hooks/useToggleState";
import SidebarItemContent from "./SidebarItemContent";
import { SidebarSubmenu } from "../../../../model/interface/sidebar/link";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";

interface SidebarItemSubmenuProps {
    link: SidebarSubmenu;
    isSidebarOpen: boolean;
    index: number;
    showTooltip: () => void;
    hideTooltip: () => void;
    isTooltipShown: boolean;
}

export default function SidebarItemSubmenu({
    index,
    isSidebarOpen,
    link,
    showTooltip,
    hideTooltip,
    isTooltipShown,
}: SidebarItemSubmenuProps) {
    const [isSubmenuOpen, setIsSubmenuOpen, toggleSubmenu] =
        useToggleState(false);
    const [openedSubmenuName, setOpenedSubmenuName] = useState<string | null>();
    const [isActive, setIsActive] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (openedSubmenuName !== link.name && isSubmenuOpen) {
            toggleSubmenu();
        }
    }, [openedSubmenuName]);

    useEffect(() => {
        const hasActiveChild =
            link.children?.some((child) =>
                location.pathname.startsWith(child.to),
            ) ?? false;

        setIsActive(hasActiveChild);

        if (hasActiveChild) {
            setOpenedSubmenuName(link.name);
            setIsSubmenuOpen(true);
        } else if (openedSubmenuName === link.name) {
            setOpenedSubmenuName(null);
            setIsSubmenuOpen(false);
        }
    }, [location.pathname]);

    const handleOpenSubmenu = () => {
        setOpenedSubmenuName(isSubmenuOpen ? null : link.name);
        toggleSubmenu();
    };

    return (
        <div
            className={`mx-2 ${index === 0 && "mt-2"} ${!isSidebarOpen && "hover:mr-0"}`}
        >
            <button
                type="button"
                onClick={handleOpenSubmenu}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                className={`hover:bg-violetLight flex w-full cursor-pointer items-center space-x-3 rounded-md pl-2 ${!isSidebarOpen ? "hover:rounded-r-none" : ""} ${isActive ? "bg-violetLight" : ""}`}
            >
                <SidebarItemContent
                    isSidebarOpen={isSidebarOpen}
                    link={link}
                    isOpen={isSubmenuOpen}
                    isTooltipShown={isTooltipShown}
                />
            </button>
            <AnimatePresence initial={false}>
                {isSubmenuOpen && isSidebarOpen && (
                    <motion.div
                        key="submenu"
                        initial={{ opacity: 0, height: 0, x: -8 }}
                        animate={{ opacity: 1, height: "auto", x: 0 }}
                        exit={{ opacity: 0, height: 0, x: -8 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 space-y-1 overflow-hidden"
                    >
                        {link.children?.map((link) => (
                            <SidebarItemSubmenuLink
                                key={link.name}
                                link={link}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
