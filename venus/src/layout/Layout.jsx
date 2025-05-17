import { Outlet, useLocation } from "react-router-dom";
import Notification from "../components/notification/Notification.jsx";
import Sidebar from "./sidebar/Sidebar.tsx";
import { useEffect } from "react";
import MobileBar from "./mobile-bar/MobileBar";
import { useToggleState } from "../hooks/useToggleState";

export default function Layout() {
  const location = useLocation();
  const isMapPage = location.pathname === "/map";
  const isForumPage = location.pathname === "/forum";
  const [isSidebarOpen, setIsSidebarOpen, toggleSidebar] =
    useToggleState(false);

  useEffect(() => {
    if (location.pathname.includes("account") && window.innerWidth >= 1280) {
      setIsSidebarOpen(true);
    }
  }, [location]);

  return (
    <div className={`${isMapPage ? "relative" : "flex"} ${isForumPage ? "min-h-screen" : "lg:h-screen"}`}>
      <Sidebar isSidebarOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main className="relative flex w-full flex-col items-center justify-center">
        <MobileBar onToggle={toggleSidebar} />
        <Notification title="test" message="message" />
        <Outlet />
      </main>
    </div>
  );
}
