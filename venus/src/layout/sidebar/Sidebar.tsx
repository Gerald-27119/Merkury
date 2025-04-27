import { FaRegBell, FaRegHeart, FaRegUser } from "react-icons/fa";
import { useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import { MdOutlineForum } from "react-icons/md";
import { FaRegMap } from "react-icons/fa6";
import { BiHome, BiMessageRounded } from "react-icons/bi";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import SidebarItem, { Link } from "./components/SidebarItem";
import useSelectorTyped from "../../hooks/useSelectorTyped";
import { useToggle } from "../../hooks/useToggle";

const staticLinks: Link[] = [
  {
    // to: "/",
    icon: <BiHome aria-label="home" />,
    name: "home",
    type: "submenu",
    children: [
      {
        to: "/",
        name: "home 1",
      },
      {
        to: "/a",
        name: "home 2",
      },
      {
        to: "/a",
        name: "home 3",
      },
      {
        to: "/a",
        name: "home 4",
      },
    ],
  },
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

const userLoggedLinks: Link[] = [
  {
    to: "/spots-list",
    icon: <FaRegHeart aria-label="spotsList" />,
    name: "favorites spots",
  },
  {
    icon: <FaRegUser aria-label="account" />,
    name: "account",
    type: "submenu",
    children: [
      {
        to: "/account",
        // icon: <FaRegUser aria-label="profile" />,
        name: "profile",
      },
      {
        to: "/edit-data",
        // icon: <TbMapPin aria-label="accountSpotsList" />,
        name: "spots",
      },
      {
        to: "/account/photos-list",
        // icon: <MdOutlinePhotoLibrary aria-label="photosList" />,
        name: "photos",
      },
      {
        to: "/account/movies-list",
        // icon: <MdOutlineVideoLibrary aria-label="moviesList" />,
        name: "movies",
      },
      {
        to: "/account/friends",
        // icon: <FiUsers aria-label="friends" />,
        name: "friends",
      },
      {
        to: "/account/add-spot",
        // icon: <TbMapPinPlus aria-label="addSpot" />,
        name: "add spot",
      },
      {
        to: "/account/comments",
        // icon: <BiComment aria-label="comments" />,
        name: "comments",
      },
      {
        to: "/account/settings",
        // icon: <BsGear aria-label="settings" />,
        name: "settings",
      },
    ],
  },
];

export default function Sidebar() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [isSidebarOpen, toggleSidebar] = useToggle(true);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>();
  const isLogged = useSelectorTyped((state) => state.account.isLogged);

  const allLinks = isLogged
    ? [...staticLinks, ...userLoggedLinks]
    : [...staticLinks];

  const optionsLinks: Link[] = [
    {
      icon: <FaRegBell aria-label="notification" />,
      name: "notification",
      type: "notification",
    },
    {
      to: !isLogged ? "/login" : undefined,
      icon: isLogged ? (
        <TbLogout2 aria-label="account" />
      ) : (
        <TbLogin2 aria-label="account" />
      ),
      name: isLogged ? "sign out" : "login",
      type: "login",
    },
    isDark
      ? {
          icon: <LuSun aria-label="changeMode" />,
          name: "light mode",
          type: "changeMode",
        }
      : {
          icon: <LuMoon aria-label="changeMode" />,
          name: "dark mode",
          type: "changeMode",
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

  return (
    <aside
      className={`bg-violetDark text-darkText absolute z-50 flex h-full shrink-0 flex-col justify-between overflow-hidden p-2 transition-all duration-300 ${isSidebarOpen ? "w-[220px]" : "w-[70px]"}`}
    >
      <div className="flex flex-col space-y-10">
        <button
          type="button"
          className="ml-2 w-fit cursor-pointer"
          onClick={toggleSidebar}
        >
          <IoMenu size={40} />
        </button>
        <nav className="flex flex-col space-y-1">
          {allLinks.map((link) => (
            <SidebarItem
              key={link.name}
              link={link}
              isSidebarOpen={isSidebarOpen}
              openSubmenu={openSubmenu}
              setOpenSubmenu={setOpenSubmenu}
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
