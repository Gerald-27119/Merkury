import { ReactElement } from "react";

type LinkType = "link" | "submenu" | "action";

export interface BaseLink {
  name: string;
  type: LinkType;
}

export interface SidebarLink extends BaseLink {
  type: "link";
  to: string;
  icon: ReactElement;
}

export interface SidebarSubmenuLink extends BaseLink {
  type: "link";
  to: string;
}

export interface SidebarSubmenu extends BaseLink {
  type: "submenu";
  to: string;
  icon: ReactElement;
  children: SidebarSubmenuLink[];
}

export interface SidebarAction extends BaseLink {
  type: "action";
  actionType: string;
  icon: ReactElement;
}

export type SidebarItemType = SidebarLink | SidebarSubmenu | SidebarAction;
