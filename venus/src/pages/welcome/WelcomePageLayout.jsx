import { Outlet } from "react-router-dom";
import Header from "../layout/header/Header.jsx";
import Notification from "../components/notification/Notification.jsx";

export default function We() {
  return (
    <>
      <Header />
      <main className="flex flex-col justify-center items-center relative overflow-hidden">
        <Notification title="test" message="message" />
        <Outlet />
      </main>
    </>
  );
}
