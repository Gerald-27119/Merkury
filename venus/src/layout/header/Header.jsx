import { NavLink, useLocation } from "react-router-dom";
import SignOutButton from "../../components/sign-out-button/SignOutButton.jsx";
import { useSelector } from "react-redux";
import SpotsFilters from "../../pages/map/components/spot-filters/SpotsFilters.jsx";
import { FaRegMoon } from "react-icons/fa";
import { useState } from "react";
import { LuSun } from "react-icons/lu";

export default function Header() {
  const { pathname } = useLocation();
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [isMouseEnter, setIsMouseEnter] = useState(false);

  const isLogged = useSelector((state) => state.account.isLogged);

  const links = [
    { to: "/", label: "Map" },
    { to: "/account", label: isLogged ? "My Account" : "Account" },
    ...(isLogged ? [{ to: "/forum", label: "Forum" }] : []),
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
    <header className="bg-gray-800 p-4 flex w-full text-3xl flex-col justify-center">
      <nav className="flex gap-20 w-full justify-center text-white">
        {links.map(({ to, label }) => (
          <NavLink
            to={to}
            key={to}
            end
            className={({ isActive }) =>
              isActive
                ? "underline underline-offset-7 decoration-text-fuchsia-100 decoration-2"
                : ""
            }
          >
            {label}
          </NavLink>
        ))}
        {isLogged && <SignOutButton />}
        <div className="relative flex justify-center">
          <button
            onClick={toggleDarkMode}
            onMouseOver={() => handleMouse(true)}
            onMouseOut={() => handleMouse(false)}
          >
            {isDark ? <LuSun /> : <FaRegMoon />}
          </button>
          {isMouseEnter && (
            <div className="absolute bg-gray-800 text-sm text-center left-1/2 transform z-50 -translate-x-1/2 top-12 h-12 w-32 rounded-md p-1">
              {`Switch to ${isDark ? "light" : "dark"} mode.`}
            </div>
          )}
        </div>
      </nav>
      {pathname === "/" && <SpotsFilters />}
    </header>
  );
}
