import { NavLink } from "react-router-dom";
import SignOutButton from "../../components/sign-out-button/SignOutButton.jsx";
import { useSelector } from "react-redux";
import { FaRegMoon } from "react-icons/fa";
import { useState } from "react";
import { LuSun } from "react-icons/lu";
import { PiDroneDuotone } from "react-icons/pi";
import { RiAccountCircleLine } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";

export default function Header() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [isMouseEnter, setIsMouseEnter] = useState(false);

  const isLogged = useSelector((state) => state.account.isLogged);
  const name = useSelector((state) => state.account.name);

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
    <header className="bg-gray-800 flex w-full items-center h-[8vh] text-3xl sm:text-2xl">
      <nav className="flex flex-1 flex-row gap-5 text-white justify-center items-center">
        <PiDroneDuotone className="mr-2" size={40} />
        <div>
          <h1>Cities</h1>
        </div>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "underline underline-offset-7 decoration-text-fuchsia-100 decoration-2"
              : ""
          }
        >
          Map
        </NavLink>

        <NavLink
          to="/forum"
          end
          className={({ isActive }) =>
            isActive
              ? "underline underline-offset-7 decoration-text-fuchsia-100 decoration-2"
              : ""
          }
        >
          Forum
        </NavLink>

        <NavLink
          to="/account"
          end
          className={({ isActive }) =>
            isActive
              ? "underline underline-offset-7 decoration-text-fuchsia-100 decoration-2 ml-2"
              : "ml-2"
          }
        >
          <div className="flex items-center">
            <p className="text-[1rem] whitespace-pre-line text-right mr-1 leading-4">
              {isLogged ? `Hi ${name}\nWelcome back!` : "Hi,\n log in"}
            </p>

            {!isLogged && <MdAccountCircle size={34} />}
          </div>
        </NavLink>

        {isLogged && <SignOutButton />}
      </nav>

      <div className="mr-8 text-white ml-20">
        <button
          onClick={toggleDarkMode}
          onMouseOver={() => handleMouse(true)}
          onMouseOut={() => handleMouse(false)}
        >
          {isDark ? <LuSun size={26} /> : <FaRegMoon size={26} />}
        </button>
        {isMouseEnter && (
          <div className="absolute bg-gray-800 text-sm text-center left-1/2 transform z-50 -translate-x-1/2 top-12 h-12 w-32 rounded-md p-1">
            {`Switch to ${isDark ? "light" : "dark"} mode.`}
          </div>
        )}
      </div>
    </header>
  );
}
