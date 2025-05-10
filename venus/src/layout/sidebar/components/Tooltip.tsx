import { NavLink } from "react-router-dom";
import { SidebarSubmenuLink } from "../../../model/interface/sidebar/link";

interface TooltipProps {
  links: SidebarSubmenuLink[];
  name: string;
}

export default function Tooltip({ links, name }: TooltipProps) {
  return (
    <div className="bg-violetLight text-darkText absolute top-0 left-full z-50 ml-3.5 rounded-r-md px-3 py-2 text-start text-base font-semibold whitespace-nowrap capitalize">
      <p className={`${links?.length ? "cursor-auto" : "cursor-pointer"}`}>
        {name}
      </p>
      {links?.map((link) => (
        <NavLink
          key={link.name}
          to={link.to}
          className="block font-normal text-gray-300"
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );
}
