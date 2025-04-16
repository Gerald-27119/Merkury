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

export default function Sidebar() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLogged = useSelector((state) => state.account.isLogged);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("account")) {
      setIsSidebarOpen(true);
    }
  }, [location]);

  const links = [
    { to: "/", icon: <BiHome size={35} aria-label="home" />, name: "home" },
    { to: "/map", icon: <FaRegMap size={35} aria-label="map" />, name: "map" },
    {
      to: "/forum",
      icon: <MdOutlineForum size={35} aria-label="forum" />,
      name: "forum",
    },
    {
      to: "/chat",
      icon: <BiMessageRounded size={35} aria-label="chat" />,
      name: "chat",
    },
    {
      to: "/spots-list",
      icon: <FaRegHeart size={35} aria-label="spotsList" />,
      name: "favorite spots",
    },
  ];

  const accountLinks = [
    {
      to: "/account/profile",
      icon: <FaRegUser size={35} aria-label="profile" />,
      name: "profile",
    },
    {
      to: "/account/spots-list",
      icon: <TbMapPin size={35} aria-label="accountSpotsList" />,
      name: "spots list",
    },
    {
      to: "/account/photos-list",
      icon: <MdOutlinePhotoLibrary size={35} aria-label="photosList" />,
      name: "photos list",
    },
    {
      to: "/account/movies-list",
      icon: <MdOutlineVideoLibrary size={35} aria-label="moviesList" />,
      name: "movies list",
    },
    {
      to: "/account/friends",
      icon: <FiUsers size={35} aria-label="friends" />,
      name: "friends",
    },
    {
      to: "/account/add-spot",
      icon: <TbMapPinPlus size={35} aria-label="addSpot" />,
      name: "add spot",
    },
    {
      to: "/account/comments",
      icon: <BiComment size={35} aria-label="comments" />,
      name: "comments",
    },
    {
      to: "/account/settings",
      icon: <BsGear size={35} aria-label="settings" />,
      name: "settings",
    },
  ];

  const optionsLinks = [
    {
      icon: <FaRegBell size={35} aria-label="notification" />,
      name: "notification",
    },
    {
      to: isLogged ? "/account/profile" : "/login",
      icon: <FaRegUser size={35} aria-label="account" />,
      name: isLogged ? "account" : "login",
    },
    isDark
      ? {
          icon: <LuSun size={35} aria-label="changeMode" />,
          name: "light mode",
        }
      : {
          icon: <LuMoon size={35} aria-label="changeMode" />,
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
      className={`bg-violetDark text-darkText shrink-0 ${isSidebarOpen ? "w-[200px]" : "w-[70px]"} flex flex-col justify-between overflow-hidden p-2 transition-all duration-300`}
    >
      <div className="flex flex-col space-y-10">
        <IoMenu size={40} onClick={toggleSideBar} className="ml-2" />
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
