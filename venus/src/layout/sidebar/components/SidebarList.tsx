import SidebarItem from "./sidebar-item/SidebarItem";
import { BaseLink } from "../model/link";

interface SidebarListProps {
  links: BaseLink[];
  isSidebarOpen: boolean;
  openSubmenu?: string | null;
  onChangeTheme?: () => void;
  setOpenSubmenu?: (name: string | null) => void;
}

export default function SidebarList(props: SidebarListProps) {
  return props.links.map((link, index) => (
    <SidebarItem key={link.name} link={link} {...props} index={index} />
  ));
}
