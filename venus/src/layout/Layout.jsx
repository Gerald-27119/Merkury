import { Outlet, useLocation } from "react-router-dom";
import NotificationList from "../components/notification/NotificationList";
import Sidebar from "./sidebar/Sidebar.tsx";
import { useEffect } from "react";
import MobileBar from "./mobile-bar/MobileBar";
import useDispatchTyped from "../hooks/useDispatchTyped";
import { sidebarAction } from "../redux/sidebar";

export default function Layout() {
    const location = useLocation();
    const isMapPage = location.pathname === "/map";
    const dispatch = useDispatchTyped();

    useEffect(() => {
        if (
            location.pathname.includes("account") &&
            window.innerWidth >= 1280
        ) {
            dispatch(sidebarAction.setIsSidebarOpen(true));
        }
    }, [location]);

    return (
        <div className={`${isMapPage ? "relative" : "flex"} min-h-screen`}>
            <Sidebar />
            <main className="relative flex w-full flex-col items-center justify-center">
                {/*<MobileBar />*/}
                <NotificationList title="test" message="message" />
                <Outlet />
            </main>
        </div>
    );
}
