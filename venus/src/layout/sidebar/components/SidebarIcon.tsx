import { BaseLink } from "../model/link";
import { isSidebarAction, isSidebarLink } from "../utils/functions";

interface SidebarIconProps {
  link: BaseLink;
}

export default function SidebarIcon({ link }: SidebarIconProps) {
  if (isSidebarLink(link) || isSidebarAction(link)) {
    return link.icon;
  }
  return null;
}
