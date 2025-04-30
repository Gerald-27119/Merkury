import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaRegBell, FaRegHeart, FaRegUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
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
import SidebarItem from "./components/SidebarItem";

const iconSize = 35;

const links = [
  { to: "/", icon: <BiHome size={iconSize} aria-label="home" />, name: "home" },
  {
    to: "/map",
    icon: <FaRegMap size={iconSize} aria-label="map" />,
    name: "map",
  },
  {
    to: "/forum",
    icon: <MdOutlineForum size={iconSize} aria-label="forum" />,
    name: "forum",
  },
  {
    to: "/chat",
    icon: <BiMessageRounded size={iconSize} aria-label="chat" />,
    name: "chat",
  },
  {
    to: "/spots-list",
    icon: <FaRegHeart size={iconSize} aria-label="spotsList" />,
    name: "favorites spots",
  },
];

const accountLinks = [
  {
    to: "/account/profile",
    icon: <FaRegUser size={iconSize} aria-label="profile" />,
    name: "profile",
  },
  {
    to: "/account/spots-list",
    icon: <TbMapPin size={iconSize} aria-label="accountSpotsList" />,
    name: "spots list",
  },
  {
    to: "/account/photos-list",
    icon: <MdOutlinePhotoLibrary size={iconSize} aria-label="photosList" />,
    name: "photos list",
  },
  {
    to: "/account/movies-list",
    icon: <MdOutlineVideoLibrary size={iconSize} aria-label="moviesList" />,
    name: "movies list",
  },
  {
    to: "/account/friends",
    icon: <FiUsers size={iconSize} aria-label="friends" />,
    name: "friends",
  },
  {
    to: "/account/add-spot",
    icon: <TbMapPinPlus size={iconSize} aria-label="addSpot" />,
    name: "add spot",
  },
  {
    to: "/account/comments",
    icon: <BiComment size={iconSize} aria-label="comments" />,
    name: "comments",
  },
  {
    to: "/account/settings",
    icon: <BsGear size={iconSize} aria-label="settings" />,
    name: "settings",
  },
];

export default function Sidebar() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLogged = useSelector((state) => state.account.isLogged);
  const location = useLocation();
  const isMapPage = location.pathname === "/map";

  useEffect(() => {
    if (location.pathname.includes("account")) {
      setIsSidebarOpen(true);
    }
  }, [location]);

  const optionsLinks = [
    {
      icon: <FaRegBell size={iconSize} aria-label="notification" />,
      name: "notification",
    },
    {
      to: isLogged ? "/account/profile" : "/login",
      icon: <FaRegUser size={iconSize} aria-label="account" />,
      name: isLogged ? "account" : "login",
    },
    isDark
      ? {
          icon: <LuSun size={iconSize} aria-label="changeMode" />,
          name: "light mode",
        }
      : {
          icon: <LuMoon size={iconSize} aria-label="changeMode" />,
          name: "dark mode",
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

  const toggleSideBar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <aside
      className={`bg-violetDark text-darkText absolute z-50 flex h-screen shrink-0 flex-col justify-between overflow-hidden p-2 transition-all duration-300 ${isMapPage ? "absolute" : "static"} ${isSidebarOpen ? "w-[220px]" : "w-[70px]"}`}
    >
      <div className="flex flex-col space-y-10">
        <button
          type="button"
          className="ml-2 w-fit cursor-pointer"
          onClick={toggleSideBar}
        >
          <IoMenu size={40} />
        </button>
        <nav className="flex flex-col space-y-1">
          {links.map(({ to, icon, name }) => (
            <SidebarItem
              key={name}
              to={to}
              icon={icon}
              name={name}
              isSidebarOpen={isSidebarOpen}
            />
          ))}
          <hr className="border-violetLight w-full" />
        </nav>
      </div>
      <div className="flex flex-col space-y-3">
        {location.pathname.includes("account") &&
          accountLinks.map(({ to, icon, name }) => (
            <SidebarItem
              key={name}
              to={to}
              icon={icon}
              name={name}
              isSidebarOpen={isSidebarOpen}
              isMiddlePart={true}
            />
          ))}
      </div>
      <div className="flex flex-col space-y-3">
        <hr className="border-violetLight w-full" />
        {optionsLinks.map(({ to, icon, name }) => (
          <SidebarItem
            key={name}
            to={to}
            icon={icon}
            name={name}
            isSidebarOpen={isSidebarOpen}
            onChangeTheme={toggleDarkMode}
          />
        ))}
      </div>
    </aside>
  );
}
