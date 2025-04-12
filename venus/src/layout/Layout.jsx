import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer.jsx";
import Header from "./header/Header.jsx";
import Notification from "../components/notification/Notification.jsx";

export default function Layout() {
  return (
    <>
      <div className="flex h-full">
        <Header />
        <main className="flex flex-col w-full justify-center items-center relative">
          <Notification title="test" message="message" />
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
