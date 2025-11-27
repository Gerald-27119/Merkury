import { SidebarItemType } from "../../model/interface/sidebar/link";
import { BiHome, BiMessageRounded } from "react-icons/bi";
import { FaRegMap } from "react-icons/fa6";
import { MdOutlineForum } from "react-icons/md";
import { FaRegBell, FaRegUser } from "react-icons/fa";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import { LuMoon, LuSun } from "react-icons/lu";

export const staticLinks = (isLogged: boolean): SidebarItemType[] => [
    {
        to: "/",
        icon: <BiHome aria-label="home" />,
        name: "home",
        type: "link",
    },
    {
        to: "/map",
        icon: <FaRegMap aria-label="map" />,
        name: "map",
        type: "link",
    },
    {
        to: "/forum",
        icon: <MdOutlineForum aria-label="forum" />,
        name: "forum",
        type: isLogged ? "submenu" : "link",
        children: !isLogged
            ? []
            : [
                  {
                      to: "/forum",
                      name: "home page",
                      type: "link",
                  },
                  {
                      to: "/forum/followed",
                      name: "followed posts",
                      type: "link",
                  },
              ],
    },
];

export const userLoggedLinks: SidebarItemType[] = [
    {
        to: "/chat",
        icon: <BiMessageRounded aria-label="chat" />,
        name: "chat",
        type: "link",
    },
    {
        icon: <FaRegUser aria-label="account" />,
        name: "account",
        type: "submenu",
        to: "/account/profile",
        children: [
            {
                to: "/account/profile",
                name: "profile",
                type: "link",
            },
            {
                to: "/account/favorite-spots",
                name: "spots",
                type: "link",
            },
            {
                to: "/account/photos",
                name: "photos",
                type: "link",
            },
            {
                to: "/account/movies",
                name: "movies",
                type: "link",
            },
            {
                to: "/account/friends",
                name: "social",
                type: "link",
            },
            {
                to: "/account/add-spot",
                name: "add spot",
                type: "link",
            },
            {
                to: "/account/comments",
                name: "comments",
                type: "link",
            },
            {
                to: "/account/settings",
                name: "settings",
                type: "link",
            },
        ],
    },
];

export const getOptionsLinks = (
    isLogged: boolean,
    isDark: boolean,
): SidebarItemType[] => {
    return [
        {
            icon: <FaRegBell aria-label="notification" />,
            name: "notification",
            actionType: "notification",
            type: "action",
        },
        isLogged
            ? {
                  icon: <TbLogout2 aria-label="login" />,
                  name: "sign out",
                  actionType: "login",
                  type: "action",
              }
            : {
                  icon: <TbLogin2 aria-label="login" />,
                  to: "/login",
                  name: "login",
                  type: "link",
              },
        isDark
            ? {
                  icon: <LuSun aria-label="changeMode" />,
                  name: "light mode",
                  actionType: "changeMode",
                  type: "action",
              }
            : {
                  icon: <LuMoon aria-label="changeMode" />,
                  name: "dark mode",
                  actionType: "changeMode",
                  type: "action",
              },
    ];
};
