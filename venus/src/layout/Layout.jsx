import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer.jsx";
import Header from "./header/Header.jsx";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="flex flex-col justify-center items-center">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
