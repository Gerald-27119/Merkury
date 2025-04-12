import { NavLink } from "react-router-dom";
import SignOutButton from "../../components/sign-out-button/SignOutButton.jsx";
import { useSelector } from "react-redux";
import { FaRegBell, FaRegHeart, FaRegMoon, FaRegUser } from "react-icons/fa";
import { useState } from "react";
import { LuSun } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import { MdOutlineForum } from "react-icons/md";
import { FaRegMap } from "react-icons/fa6";
import { BiHome, BiMessageRounded } from "react-icons/bi";

export default function Header() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [isMouseEnter, setIsMouseEnter] = useState(false);

  const isLogged = useSelector((state) => state.account.isLogged);

  const links = [
    { to: "/", label: <BiHome size={35} title="home" /> },
    { to: "/map", label: <FaRegMap size={35} title="map" /> },
    { to: "/forum", label: <MdOutlineForum size={35} title="forum" /> },
    { to: "/chat", label: <BiMessageRounded size={35} title="chat" /> },
    { to: "/spots-list", label: <FaRegHeart size={35} title="spotsList" /> },
  ];

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleMouse = (isEnter) => {
    setIsMouseEnter(isEnter);
  };

  return (
    <header className="bg-gray-800 p-4 flex flex-col w-16 text-3xl items-center justify-between text-darkText">
      <div className="space-y-10 flex flex-col items-center">
        <IoMenu size={40} />
        <nav className="flex flex-col w-full items-center space-y-5">
          {links.map(({ to, label }) => (
            <NavLink to={to} key={to} end>
              {label}
            </NavLink>
          ))}
          <hr className="w-12" />
        </nav>
      </div>
      <div className="flex flex-col items-center space-y-8">
        <hr className="w-12" />
        {isLogged && <SignOutButton />}
        <FaRegBell size={35} title="notification" />
        <NavLink
          to="/account"
          end
          className={({ isActive }) =>
            isActive
              ? "underline underline-offset-7 decoration-text-fuchsia-100 decoration-2"
              : ""
          }
        >
          <FaRegUser size={35} title="account" />
        </NavLink>
        <div className="relative flex justify-center">
          <button
            onClick={toggleDarkMode}
            onMouseOver={() => handleMouse(true)}
            onMouseOut={() => handleMouse(false)}
            title="changeMode"
          >
            {isDark ? <LuSun size={35} /> : <FaRegMoon size={35} />}
          </button>
          {isMouseEnter && (
            <div className="absolute bg-gray-800 text-sm text-center left-28 transform z-50 -translate-x-1/2 h-12 w-32 rounded-md p-1">
              {`Switch to ${isDark ? "light" : "dark"} mode.`}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
