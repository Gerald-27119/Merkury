import { NavLink } from "react-router-dom";
import SidebarItemContent from "./SidebarItemContent";
import { SidebarLink } from "../../../../model/interface/sidebar/link";

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
  return (
    <NavLink
      to={link.to}
      end
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      className={`mx-2 flex items-center space-x-3 rounded-md pl-2 transition-all ${!isSidebarOpen && "hover:bg-violetLight mr-0 rounded-r-none transition-none"}`}
    >
      {({ isActive }) => (
        <SidebarItemContent
          isSidebarOpen={isSidebarOpen}
          isActive={isActive}
          link={link}
          isTooltipShown={isTooltipShown}
        />
      )}
    </NavLink>
  );
}
