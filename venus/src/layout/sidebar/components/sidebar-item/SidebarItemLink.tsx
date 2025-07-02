import { NavLink } from "react-router-dom";
import SidebarItemContent from "./SidebarItemContent";
import { SidebarLink } from "../../../../model/interface/sidebar/link";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { closeSidebar } from "../../../../redux/sidebar";

interface SidebarItemLinkProps {
    link: SidebarLink;
    isSidebarOpen: boolean;
    showTooltip: () => void;
    hideTooltip: () => void;
    isTooltipShown: boolean;
}

export default function SidebarItemLink({
    link,
    showTooltip,
    hideTooltip,
    isSidebarOpen,
    isTooltipShown,
}: SidebarItemLinkProps) {
    const dispatch = useDispatchTyped();

    const handleClose = () => dispatch(closeSidebar());

    return (
        <NavLink
            to={link.to}
            end
            onClick={handleClose}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            className={({ isActive }) =>
                `hover:bg-violetLight mx-2 flex items-center space-x-3 rounded-md pl-2 transition-all ${!isSidebarOpen ? "transition-none hover:mr-0 hover:rounded-r-none" : ""} ${isActive ? "bg-violetLight" : ""}`
            }
        >
            <SidebarItemContent
                isSidebarOpen={isSidebarOpen}
                link={link}
                isTooltipShown={isTooltipShown}
            />
        </NavLink>
    );
}
