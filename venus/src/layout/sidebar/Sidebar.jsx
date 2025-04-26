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

const staticLinks = [
  { to: "/", icon: <BiHome aria-label="home" />, name: "home" },
  { to: "/map", icon: <FaRegMap aria-label="map" />, name: "map" },
  {
    to: "/forum",
    icon: <MdOutlineForum aria-label="forum" />,
    name: "forum",
  },
  {
    to: "/chat",
    icon: <BiMessageRounded aria-label="chat" />,
    name: "chat",
  },
];

const userLoggedLinks = [
  {
    to: "/spots-list",
    icon: <FaRegHeart aria-label="spotsList" />,
    name: "favorites spots",
  },
  {
    to: "/account/profile",
    icon: <FaRegUser aria-label="account" />,
    name: "account",
    children: [
      {
        to: "/account/profile",
        icon: <FaRegUser aria-label="profile" />,
        name: "profile",
      },
      {
        to: "/account/spots-list",
        icon: <TbMapPin aria-label="accountSpotsList" />,
        name: "spots",
      },
      {
        to: "/account/photos-list",
        icon: <MdOutlinePhotoLibrary aria-label="photosList" />,
        name: "photos",
      },
      {
        to: "/account/movies-list",
        icon: <MdOutlineVideoLibrary aria-label="moviesList" />,
        name: "movies",
      },
      {
        to: "/account/friends",
        icon: <FiUsers aria-label="friends" />,
        name: "friends",
      },
      {
        to: "/account/add-spot",
        icon: <TbMapPinPlus aria-label="addSpot" />,
        name: "add spot",
      },
      {
        to: "/account/comments",
        icon: <BiComment aria-label="comments" />,
        name: "comments",
      },
      {
        to: "/account/settings",
        icon: <BsGear aria-label="settings" />,
        name: "settings",
      },
    ],
  },
];

export default function Sidebar() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLogged = useSelector((state) => state.account.isLogged);

  const location = useLocation();

  const links = isLogged
    ? [...staticLinks, ...userLoggedLinks]
    : [...staticLinks];

  useEffect(() => {
    if (location.pathname.includes("account")) {
      setIsSidebarOpen(true);
    }
  }, [location]);

  const optionsLinks = [
    {
      icon: <FaRegBell aria-label="notification" />,
      name: "notification",
    },
    {
      to: !isLogged && "/login",
      icon: <FaRegUser aria-label="account" />,
      name: isLogged ? "sign out" : "login",
    },
    isDark
      ? {
          icon: <LuSun aria-label="changeMode" />,
          name: "light mode",
        }
      : {
          icon: <LuMoon aria-label="changeMode" />,
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
      className={`bg-violetDark text-darkText absolute z-50 flex h-full shrink-0 flex-col justify-between overflow-hidden p-2 transition-all duration-300 ${isSidebarOpen ? "w-[220px]" : "w-[70px]"}`}
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
          {links.map((link) => (
            <SidebarItem
              key={link.name}
              link={link}
              isSidebarOpen={isSidebarOpen}
            />
          ))}
          <hr className="border-violetLight mt-1 w-full" />
        </nav>
      </div>
      <div className="flex flex-col space-y-3">
        <hr className="border-violetLight w-full" />
        {optionsLinks.map((link) => (
          <SidebarItem
            key={link.name}
            link={link}
            isSidebarOpen={isSidebarOpen}
            onChangeTheme={toggleDarkMode}
          />
        ))}
      </div>
    </aside>
  );
}
