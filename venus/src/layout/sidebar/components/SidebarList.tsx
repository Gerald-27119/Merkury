import SidebarItem, { Link } from "./sidebar-item/SidebarItem";

interface SidebarListProps {
  links: Link[];
  isSidebarOpen: boolean;
  openSubmenu?: string | null;
  onChangeTheme?: () => void;
  setOpenSubmenu?: (name: string | null) => void;
}

export default function SidebarList({
  links,
  isSidebarOpen,
  openSubmenu,
  onChangeTheme,
  setOpenSubmenu,
}: SidebarListProps) {
  return links.map((link) => (
    <SidebarItem
      key={link.name}
      link={link}
      isSidebarOpen={isSidebarOpen}
      openSubmenu={openSubmenu}
      setOpenSubmenu={setOpenSubmenu}
      onChangeTheme={onChangeTheme}
    />
  ));
}
