import { useState } from "react";
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
} from "./utils/sidebarLinks";

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isSidebarOpen, onToggle }: SidebarProps) {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>();
  const isLogged = useSelectorTyped((state) => state.account.isLogged);
  const location = useLocation();
  const isAccountPage = location.pathname.includes("/account");
  const isChatPage = location.pathname.includes("/chat");

  const allLinks = isLogged
    ? [...staticLinks, ...userLoggedLinks]
    : [...staticLinks];

  const optionsLinks = getOptionsLinks(isLogged, isDark);

  return (
    <aside
      className={`bg-violetDark text-darkText fixed top-0 left-0 z-50 flex h-full shrink-0 flex-col justify-between py-2 transition-all duration-300 ${isAccountPage || isChatPage ? "xl:static" : "absolute"} ${isSidebarOpen ? "w-full translate-x-0 xl:w-[220px]" : "w-0 -translate-x-full p-0 lg:w-[70px] xl:translate-x-0"}`}
    >
      <div className="flex flex-col space-y-10">
        <SidebarToggleButton onToggle={onToggle} />
        <SidebarSection showBottomHr={true}>
          <SidebarList
            links={allLinks}
            isSidebarOpen={isSidebarOpen}
            openSubmenu={openSubmenu}
            setOpenSubmenu={setOpenSubmenu}
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
