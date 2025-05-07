import { NavLink } from "react-router-dom";
import { BaseLink } from "../model/link";
import { isSidebarAction, isSidebarLink } from "../utils/functions";

interface SidebarIconProps {
  link: BaseLink;
  isSidebarOpen: boolean;
}

export default function SidebarIcon({ link, isSidebarOpen }: SidebarIconProps) {
  if (isSidebarLink(link)) {
    return isSidebarOpen ? (
      link.icon
    ) : (
      <NavLink to={link.to}>{link.icon}</NavLink>
    );
  }
  if (isSidebarAction(link)) {
    return <>{link.icon}</>;
  }
  return null;
}
