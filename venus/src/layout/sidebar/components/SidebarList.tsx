import SidebarItem from "./sidebar-item/SidebarItem";
import { BaseLink } from "../../../model/interface/sidebar/link";

interface SidebarListProps {
  links: BaseLink[];
  isSidebarOpen: boolean;
  onChangeTheme?: () => void;
}

export default function SidebarList(props: SidebarListProps) {
  return props.links.map((link, index) => (
    <SidebarItem key={link.name} link={link} {...props} index={index} />
  ));
}
