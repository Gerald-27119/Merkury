import { NavLink } from "react-router-dom";
import SignOutButton from "../../pages/account/SignOutButton.jsx";

export default function Header() {
  const activeClassNames =
    "underline underline-offset-7 decoration-text-fuchsia-100 decoration-2";

  return (
    <header className="bg-gray-800 text-white p-4 flex w-full text-3xl">
      <nav className="flex gap-20 w-full justify-center">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? activeClassNames : "")}
        >
          Welcome
        </NavLink>
        <NavLink
          to="forum"
          end
          className={({ isActive }) => (isActive ? activeClassNames : "")}
        >
          Forum
        </NavLink>
        <NavLink
          to="account"
          end
          className={({ isActive }) => (isActive ? activeClassNames : "")}
        >
          Account
        </NavLink>
        <SignOutButton />
      </nav>
    </header>
  );
}
