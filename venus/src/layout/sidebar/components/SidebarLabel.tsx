import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { BaseLink } from "../model/link";
import { isSidebarSubmenu } from "../utils/functions";

interface SidebarLabelProps {
  link: BaseLink;
  isOpen?: boolean;
  isChildren?: boolean;
  isActive: boolean;
  isDot?: boolean;
  isSidebarOpen: boolean;
}

export default function SidebarLabel({
  link,
  isOpen,
  isChildren,
  isActive,
  isDot,
  isSidebarOpen,
}: SidebarLabelProps) {
  return (
    <p
      className={`ml-2 flex items-center text-start font-semibold capitalize transition-all duration-300 ${
        isSidebarOpen
          ? "min-w-[10rem] translate-x-0 opacity-100"
          : "min-w-[1rem] -translate-x-13 text-xs font-extralight opacity-0"
      }`}
    >
      {link.name}
      {isSidebarSubmenu(link) &&
        link.children?.length > 0 &&
        (isOpen ? (
          <IoIosArrowUp className="ml-2" />
        ) : (
          <IoIosArrowDown className="ml-2" />
        ))}

      {!isChildren && (isActive || isDot) && <GoDotFill className="ml-2" />}
    </p>
  );
}
