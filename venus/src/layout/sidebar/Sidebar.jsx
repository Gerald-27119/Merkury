import { NavLink } from "react-router-dom";
import SignOutButton from "../../components/sign-out-button/SignOutButton.jsx";
import { useSelector } from "react-redux";
import { FaRegBell, FaRegHeart, FaRegMoon, FaRegUser } from "react-icons/fa";
import { useState } from "react";
import { LuSun } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import {
  MdOutlineForum,
  MdOutlinePhotoLibrary,
  MdOutlineVideoLibrary,
} from "react-icons/md";
import { FaRegMap } from "react-icons/fa6";
import { BiComment, BiHome, BiMessageRounded } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { TbMapPin, TbMapPinPlus } from "react-icons/tb";
import { BsGear } from "react-icons/bs";

export default function Sidebar() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLogged = useSelector((state) => state.account.isLogged);

  const links = [
    { to: "/", label: <BiHome size={35} aria-label="home" />, name: "home" },
    { to: "/map", label: <FaRegMap size={35} aria-label="map" />, name: "map" },
    {
      to: "/forum",
      label: <MdOutlineForum size={35} aria-label="forum" />,
      name: "forum",
    },
    {
      to: "/chat",
      label: <BiMessageRounded size={35} aria-label="chat" />,
      name: "chat",
    },
    {
      to: "/spots-list",
      label: <FaRegHeart size={35} aria-label="spotsList" />,
      name: "favorite spots",
    },
  ];

  const accountLinks = [
    {
      to: "/account/profile",
      label: <FaRegUser size={35} aria-label="profile" />,
      name: "profile",
    },
    {
      to: "/account/spots-list",
      label: <TbMapPin size={35} aria-label="accountSpotsList" />,
      name: "spots list",
    },
    {
      to: "/account/photos-list",
      label: <MdOutlinePhotoLibrary size={35} aria-label="photosList" />,
      name: "photos list",
    },
    {
      to: "/account/movies-list",
      label: <MdOutlineVideoLibrary size={35} aria-label="moviesList" />,
      name: "movies list",
    },
    {
      to: "/account/friends",
      label: <FiUsers size={35} aria-label="friends" />,
      name: "friends",
    },
    {
      to: "/account/add-spot",
      label: <TbMapPinPlus size={35} aria-label="addSpot" />,
      name: "add spot",
    },
    {
      to: "/account/comments",
      label: <BiComment size={35} aria-label="comments" />,
      name: "comments",
    },
    {
      to: "/account/settings",
      label: <BsGear size={35} aria-label="settings" />,
      name: "settings",
    },
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

  const toggleSideBar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <header
      className={`bg-violetDark text-darkText ${isSidebarOpen ? "w-56" : "w-17"} flex flex-col items-start justify-between overflow-hidden p-4 text-3xl transition-all duration-300`}
    >
      <div className="flex w-full flex-col items-start space-y-10">
        <IoMenu size={40} onClick={toggleSideBar} />
        <nav className="flex w-full flex-col items-start space-y-5">
          {links.map(({ to, label, name }) => (
            <NavLink
              to={to}
              key={to}
              end
              className="flex w-full items-center gap-4 rounded-md transition-all duration-300"
            >
              <div className="flex w-10 justify-center">{label}</div>
              <p
                className={`text-base font-medium capitalize transition-all duration-300 ${
                  isSidebarOpen
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none -translate-x-4 opacity-0"
                }`}
              >
                {name}
              </p>
            </NavLink>
          ))}
          <hr className="border-violetLight w-full" />
        </nav>
      </div>
      <div className="flex w-full flex-col items-center space-y-5">
        {accountLinks.map(({ to, label, name }) => (
          <NavLink
            to={to}
            key={to}
            end
            className="hover:bg-violetLight flex w-full items-center gap-4 rounded-md px-1 py-1.5 transition-all duration-300"
          >
            <div className="flex w-10 justify-center">{label}</div>
            <p
              className={`text-base font-medium capitalize transition-all duration-300 ${
                isSidebarOpen
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none -translate-x-4 opacity-0"
              }`}
            >
              {name}
            </p>
          </NavLink>
        ))}
      </div>
      <div className="flex w-full flex-col items-center space-y-8">
        <hr className="border-violetLight w-full" />
        {isLogged && <SignOutButton />}
        <FaRegBell size={35} aria-label="notification" />
        <NavLink
          to="/account"
          end
          className={({ isActive }) =>
            isActive
              ? "decoration-text-fuchsia-100 underline decoration-2 underline-offset-7"
              : ""
          }
        >
          <FaRegUser size={35} aria-label="account" />
        </NavLink>
        <div className="relative flex justify-center">
          <button
            onClick={toggleDarkMode}
            onMouseOver={() => handleMouse(true)}
            onMouseOut={() => handleMouse(false)}
            aria-label="changeMode"
          >
            {isDark ? <LuSun size={35} /> : <FaRegMoon size={35} />}
          </button>
          {isMouseEnter && (
            <div className="bg-violetDark absolute left-28 z-50 h-12 w-32 -translate-x-1/2 transform rounded-md p-1 text-center text-sm">
              {`Switch to ${isDark ? "light" : "dark"} mode.`}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
