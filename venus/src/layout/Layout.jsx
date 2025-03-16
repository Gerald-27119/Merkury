import { Outlet, useLocation } from "react-router-dom";
import Footer from "./footer/Footer.jsx";
import Header from "./header/Header.jsx";
import Notification from "../components/notification/Notification.jsx";

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="flex flex-col justify-center items-center relative">
        <Notification title="test" message="message" />
        <Outlet />
      </main>
      {location.pathname !== "/map" && <Footer />}
    </>
  );
}
