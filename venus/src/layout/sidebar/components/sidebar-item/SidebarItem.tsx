import {
    BaseLink,
    SidebarAction,
    SidebarLink,
    SidebarSubmenu,
} from "../../../../model/interface/sidebar/link";
import SidebarItemSubmenu from "./SidebarItemSubmenu";
import SidebarItemAction from "./SidebarItemAction";
import SidebarItemLink from "./SidebarItemLink";
import { useBoolean } from "../../../../hooks/useBoolean";

interface SidebarItemProps {
    link: BaseLink;
    isSidebarOpen: boolean;
    onChangeTheme?: () => void;
    index: number;
}

export default function SidebarItem({
    link,
    isSidebarOpen,
    onChangeTheme,
    index,
}: SidebarItemProps) {
    const [isTooltipShown, showTooltip, hideTooltip] = useBoolean(false);

    switch (link.type) {
        case "submenu":
            return (
                <SidebarItemSubmenu
                    isSidebarOpen={isSidebarOpen}
                    link={link as SidebarSubmenu}
                    index={index}
                    showTooltip={showTooltip}
                    hideTooltip={hideTooltip}
                    isTooltipShown={isTooltipShown}
                />
            );
        case "action":
            return (
                <SidebarItemAction
                    link={link as SidebarAction}
                    isSidebarOpen={isSidebarOpen}
                    onChangeTheme={onChangeTheme!}
                    showTooltip={showTooltip}
                    hideTooltip={hideTooltip}
                    isTooltipShown={isTooltipShown}
                />
            );
        case "link":
        default:
            return (
                <SidebarItemLink
                    link={link as SidebarLink}
                    isSidebarOpen={isSidebarOpen}
                    showTooltip={showTooltip}
                    hideTooltip={hideTooltip}
                    isTooltipShown={isTooltipShown}
                />
            );
    }
}
