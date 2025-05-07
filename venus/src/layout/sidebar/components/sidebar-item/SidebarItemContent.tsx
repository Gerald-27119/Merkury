import { BaseLink } from "../../model/link";
import Tooltip from "../Tooltip";
import SidebarIcon from "../SidebarIcon";
import SidebarLabel from "../SidebarLabel";
import { isSidebarSubmenu } from "../../utils/functions";

interface SidebarItemContentProps {
  link: BaseLink;
  isSidebarOpen: boolean;
  isActive: boolean;
  isChildren?: boolean;
  isDot?: boolean;
  isTooltipShown: boolean;
  isOpen?: boolean;
}

export default function SidebarItemContent({
  link,
  isChildren,
  isSidebarOpen,
  isOpen,
  isTooltipShown,
  isDot,
  isActive,
}: SidebarItemContentProps) {
  return (
    <div className="flex items-center">
      <div
        className={`relative flex shrink-0 items-center justify-center text-3xl ${isChildren ? "h-10 w-5" : "h-10 w-10"}`}
      >
        <SidebarIcon link={link} isSidebarOpen={isSidebarOpen} />
        {!isSidebarOpen && isTooltipShown && (
          <Tooltip
            name={link.name}
            links={isSidebarSubmenu(link) ? link.children : []}
          />
        )}
      </div>

      {isSidebarOpen && (
        <SidebarLabel
          link={link}
          isOpen={isOpen}
          isChildren={isChildren}
          isActive={isActive}
          isDot={isDot}
        />
      )}
    </div>
  );
}
