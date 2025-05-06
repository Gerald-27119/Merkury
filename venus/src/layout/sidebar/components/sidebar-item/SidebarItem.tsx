import { BaseLink } from "../../model/link";
import SidebarItemSubmenu from "./SidebarItemSubmenu";
import SidebarItemAction from "./SidebarItemAction";
import SidebarItemLink from "./SidebarItemLink";

interface SidebarItemProps {
  link: BaseLink;
  isSidebarOpen: boolean;
  onChangeTheme?: () => void;
  isChildren?: boolean;
  index?: number;
  openSubmenu?: string | null;
  setOpenSubmenu?: (name: string | null) => void;
}

export default function SidebarItem(props: SidebarItemProps) {
  switch (props.link.type) {
    case "submenu":
      return <SidebarItemSubmenu {...props} />;
    case "action":
      return <SidebarItemAction {...props} />;
    case "link":
    default:
      return <SidebarItemLink {...props} />;
  }
}
