import { BaseLink } from "../model/link";
import {
  isSidebarAction,
  isSidebarLink,
  isSidebarSubmenu,
} from "../utils/functions";
import { NavLink } from "react-router-dom";

interface SidebarIconProps {
  link: BaseLink;
  isSidebarOpen: boolean;
}

export default function SidebarIcon({ link, isSidebarOpen }: SidebarIconProps) {
  if (isSidebarSubmenu(link) && !isSidebarOpen) {
    return <NavLink to={link.to}>{link.icon}</NavLink>;
  }

  if (isSidebarLink(link) || isSidebarAction(link)) {
    return link.icon;
  }
  return null;
}
