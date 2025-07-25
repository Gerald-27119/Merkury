import useSelectorTyped from "../../hooks/useSelectorTyped";
import { useLocation } from "react-router-dom";
import SidebarList from "./components/SidebarList";
import { useDarkMode } from "../../hooks/useDarkMode";
import SidebarSection from "./components/SidebarSection";
import SidebarToggleButton from "./components/SidebarToggleButton";
import {
    getOptionsLinks,
    staticLinks,
    userLoggedLinks,
} from "../../utils/sidebar/sidebarLinks";

export default function Sidebar() {
    const [isDark, toggleDarkMode] = useDarkMode();
    const isLogged = useSelectorTyped((state) => state.account.isLogged);
    const isSidebarOpen = useSelectorTyped((state) => state.sidebar.isOpen);
    const location = useLocation();
    const isAccountPage = location.pathname.includes("/account");
    const isChatPage = location.pathname.includes("/chat");
    const isHomePage = location.pathname === "/";
    const isStickyLayoutPage = isAccountPage || isChatPage || isHomePage;

    const allLinks = isLogged
        ? [...staticLinks, ...userLoggedLinks]
        : [...staticLinks];

    const optionsLinks = getOptionsLinks(isLogged, isDark);

    return (
        <aside
            className={`bg-violetDark text-darkText fixed top-0 left-0 z-50 flex h-screen shrink-0 flex-col justify-between py-2 transition-all duration-300 ${isStickyLayoutPage ? "xl:sticky" : "absolute"} ${isSidebarOpen ? "w-full translate-x-0 xl:w-[220px]" : "w-[220px] -translate-x-full p-0 xl:w-[70px] xl:translate-x-0"}`}
        >
            <div className="flex flex-col space-y-10">
                <SidebarToggleButton />
                <SidebarSection showBottomHr={true}>
                    <SidebarList
                        links={allLinks}
                        isSidebarOpen={isSidebarOpen}
                    />
                </SidebarSection>
            </div>
            <SidebarSection showTopHr={true}>
                <SidebarList
                    links={optionsLinks}
                    isSidebarOpen={isSidebarOpen}
                    onChangeTheme={toggleDarkMode}
                />
            </SidebarSection>
        </aside>
    );
}
