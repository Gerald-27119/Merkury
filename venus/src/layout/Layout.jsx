import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer.jsx";
import Notification from "../components/notification/Notification.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";

export default function Layout() {
  return (
    <>
      <div className="flex h-full">
        <Sidebar />
        <main className="relative flex w-full flex-col items-center justify-center">
          <Notification title="test" message="message" />
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
