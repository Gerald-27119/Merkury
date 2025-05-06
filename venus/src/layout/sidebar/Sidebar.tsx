import { FaRegBell, FaRegHeart, FaRegUser } from "react-icons/fa";
import { useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import { MdOutlineForum } from "react-icons/md";
import { FaRegMap } from "react-icons/fa6";
import { BiHome, BiMessageRounded } from "react-icons/bi";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import { Link } from "./components/sidebar-item/SidebarItem";
import useSelectorTyped from "../../hooks/useSelectorTyped";
import { useLocation } from "react-router-dom";
import SidebarList from "./components/SidebarList";
import { useDarkMode } from "../../hooks/useDarkMode";
import SidebarSection from "./components/SidebarSection";

const staticLinks: Link[] = [
  {
    to: "/",
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
    to: "/account/profile",
    children: [
      {
        to: "/account/profile",
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

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isSidebarOpen, onToggle }: SidebarProps) {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>();
  const isLogged = useSelectorTyped((state) => state.account.isLogged);
  const location = useLocation();
  const isAccountPage = location.pathname.includes("/account");
  const isChatPage = location.pathname.includes("/chat");

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

  return (
    <aside
      className={`bg-violetDark text-darkText fixed top-0 left-0 z-50 flex h-full shrink-0 flex-col justify-between py-2 transition-all duration-300 ${isAccountPage || isChatPage ? "xl:static" : "absolute"} ${isSidebarOpen ? "w-full translate-x-0 xl:w-[220px]" : "w-0 -translate-x-full p-0 lg:w-[70px] xl:translate-x-0"}`}
    >
      <div className="flex flex-col space-y-10">
        <div className="bg-violetDark mx-2 flex items-center justify-between">
          <button
            type="button"
            className="ml-2 w-fit cursor-pointer"
            onClick={onToggle}
          >
            <IoMenu size={40} />
          </button>
          <span className="text-darkText mr-2 font-semibold xl:hidden">
            Merkury
          </span>
        </div>
        <SidebarSection showBottomHr={true}>
          <SidebarList
            links={allLinks}
            isSidebarOpen={isSidebarOpen}
            openSubmenu={openSubmenu}
            setOpenSubmenu={setOpenSubmenu}
          />
        </SidebarSection>
      </div>
      <SidebarSection showTopHr={true}>
        <SidebarList
          links={optionsLinks}
          isSidebarOpen={isSidebarOpen}
          onChangeTheme={toggleDarkMode}
        />
      </SidebarSection>
    </aside>
  );
}
