import { NavLink } from "react-router-dom";

export default function Switch() {
    return (
        <div className="dark:shadow-darkBgSoft flex rounded-full shadow-lg shadow-black/20">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `hover:dark:bg-violetDark hover:bg-violetLight rounded-l-full px-2.5 py-1.5 transition-all duration-300 ${isActive ? "dark:bg-violetDark bg-violetLight" : ""}`
                }
            >
                Simple filters
            </NavLink>
            <NavLink
                to="/advanced"
                className={({ isActive }) =>
                    `hover:dark:bg-violetDark hover:bg-violetLight rounded-r-full px-2.5 py-1.5 transition-all duration-300 ${isActive ? "dark:bg-violetDark bg-violetLight" : ""}`
                }
            >
                Advanced filters
            </NavLink>
        </div>
    );
}
