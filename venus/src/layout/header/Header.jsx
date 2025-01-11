import { NavLink } from "react-router-dom";
import SignOutButton from "../../pages/account/SignOutButton.jsx";
import { useSelector } from "react-redux";
import SpotsFilters from "../../components/map/filters/SpotsFilters.jsx";

export default function Header() {
  const activeClassNames =
    "underline underline-offset-7 decoration-text-fuchsia-100 decoration-2";

  const isLogged = useSelector((state) => state.account.isLogged);

  return (
    <header className="bg-gray-800 p-4 flex w-full text-3xl flex-col justify-center">
      <nav className="flex gap-20 w-full justify-center text-white">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? activeClassNames : "")}
        >
          Welcome
        </NavLink>
        {isLogged && (
          <NavLink
            to="forum"
            end
            className={({ isActive }) => (isActive ? activeClassNames : "")}
          >
            Forum
          </NavLink>
        )}
        <NavLink
          to="account"
          end
          className={({ isActive }) => (isActive ? activeClassNames : "")}
        >
          {isLogged ? "My Account" : "Account"}
        </NavLink>
        {isLogged && <SignOutButton />}
      </nav>
      <SpotsFilters />
    </header>
  );
}
