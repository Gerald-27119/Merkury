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
}

export default function SidebarLabel({
  link,
  isOpen,
  isChildren,
  isActive,
  isDot,
}: SidebarLabelProps) {
  return (
    <p className="ml-2 flex min-w-[10rem] items-center text-start font-semibold capitalize">
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
