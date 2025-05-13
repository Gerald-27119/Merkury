import { NavLink } from "react-router-dom";
import { SidebarSubmenuLink } from "../../../model/interface/sidebar/link";

interface TooltipProps {
  links: SidebarSubmenuLink[];
  name: string;
}

export default function Tooltip({ links, name }: TooltipProps) {
  return (
    <div className="bg-violetLight text-darkText absolute top-0 left-full z-50 ml-3.5 rounded-r-md pt-2 text-start text-base font-semibold whitespace-nowrap capitalize">
      <p
        className={`${links?.length ? "cursor-auto" : "cursor-pointer"} px-3 pb-2`}
      >
        {name}
      </p>
      {links?.map((link) => (
        <NavLink
          key={link.name}
          to={link.to}
          className="hover:bg-violetDark block px-3 pb-1 font-normal text-gray-300 last:rounded-br-md"
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );
}
