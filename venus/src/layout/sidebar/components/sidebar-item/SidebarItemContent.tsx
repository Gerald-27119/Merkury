import { BaseLink } from "../../../../model/interface/sidebar/link";
import Tooltip from "../Tooltip";
import SidebarIcon from "../SidebarIcon";
import SidebarLabel from "../SidebarLabel";
import { isSidebarSubmenu } from "../../../../utils/sidebar/functions";

interface SidebarItemContentProps {
    link: BaseLink;
    isSidebarOpen: boolean;
    isTooltipShown: boolean;
    isOpen?: boolean;
}

export default function SidebarItemContent({
    link,
    isSidebarOpen,
    isOpen,
    isTooltipShown,
}: SidebarItemContentProps) {
    return (
        <div className="flex items-center transition-all">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center text-3xl">
                <SidebarIcon link={link} isSidebarOpen={isSidebarOpen} />
                {!isSidebarOpen && isTooltipShown && (
                    <Tooltip
                        name={link.name}
                        links={isSidebarSubmenu(link) ? link.children : []}
                    />
                )}
            </div>
            <SidebarLabel
                link={link}
                isOpen={isOpen}
                isSidebarOpen={isSidebarOpen}
            />
        </div>
    );
}
