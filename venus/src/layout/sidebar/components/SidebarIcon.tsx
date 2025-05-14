import { BaseLink } from "../../../model/interface/sidebar/link";
import {
  isSidebarAction,
  isSidebarLink,
  isSidebarSubmenu,
} from "../../../utils/sidebar/functions";
import { NavLink } from "react-router-dom";

interface SidebarIconProps {
  link: BaseLink;
  isSidebarOpen: boolean;
}

export default function SidebarIcon({ link, isSidebarOpen }: SidebarIconProps) {
  if (isSidebarSubmenu(link) && !isSidebarOpen) {
    return (
      <NavLink
        to={link.to}
        className="flex h-10 w-10 items-center justify-center"
      >
        <span className="z-50 flex h-full w-full items-center justify-center">
          {link.icon}
        </span>
      </NavLink>
    );
  }

  if (isSidebarLink(link) || isSidebarAction(link)) {
    return link.icon;
  }
  return null;
}
