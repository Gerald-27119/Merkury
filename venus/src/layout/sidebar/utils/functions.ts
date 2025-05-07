import {
  BaseLink,
  SidebarAction,
  SidebarLink,
  SidebarSubmenu,
} from "../model/link";

export function isSidebarSubmenu(link: BaseLink): link is SidebarSubmenu {
  return "children" in link && Array.isArray(link.children);
}

export function isSidebarAction(link: BaseLink): link is SidebarAction {
  return "actionType" in link && typeof link.actionType === "string";
}

export function isSidebarLink(link: BaseLink): link is SidebarLink {
  return "to" in link && typeof link.to === "string";
}
