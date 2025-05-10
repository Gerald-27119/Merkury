import { NavLink } from "react-router-dom";
import { SidebarSubmenuLink } from "../../../../model/interface/sidebar/link";

interface SidebarItemSubmenuProps {
  link: SidebarSubmenuLink;
}

export default function SidebarItemSubmenuLink({
  link,
}: SidebarItemSubmenuProps) {
  return (
    <NavLink
      to={link.to}
      end
      className={({ isActive }) =>
        `hover:bg-violetLight mx-2 flex items-center space-x-1 rounded-md text-gray-300 ${isActive && "bg-violetLight"}`
      }
    >
      <p className="ml-12 min-w-[10rem] py-1.5 text-start font-semibold capitalize">
        {link.name}
      </p>
    </NavLink>
  );
}
