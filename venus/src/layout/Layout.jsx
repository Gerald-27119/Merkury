import { Outlet, useLocation } from "react-router-dom";
import Notification from "../components/notification/Notification.jsx";
import Sidebar from "./sidebar/Sidebar.tsx";
import { useEffect, useState } from "react";
import MobileBar from "./mobile-bar/MobileBar";

export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("account") && window.innerWidth >= 1280) {
      setIsSidebarOpen(true);
    }
  }, [location]);

  const toggleSideBar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const closeSideBar = () => {
    if (window.innerWidth < 1280) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div
      className={`${location.pathname.includes("account") ? "flex" : "relative"} lg:h-screen`}
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onToggle={toggleSideBar}
        onClose={closeSideBar}
      />
      <main className="relative flex w-full flex-col items-center justify-center">
        <MobileBar onToggle={toggleSideBar} />
        <Notification title="test" message="message" />
        <Outlet />
      </main>
    </div>
  );
}
