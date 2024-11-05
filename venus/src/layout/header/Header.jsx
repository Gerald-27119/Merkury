import { NavLink } from "react-router-dom";
import SignOutButton from "../../pages/account/SignOutButton.jsx";

export default function Header() {
  // const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <header className="bg-gray-800 text-white p-4 flex w-full text-3xl">
      <nav className="flex gap-20 w-full justify-center">
        <NavLink to="/" end>
          Welcome
        </NavLink>
        <NavLink to="#" end>
          Forum
        </NavLink>
        <NavLink
          // to={isAuthenticated ? "/account" : "/login"}
          to="account"
          end
        >
          Account
        </NavLink>
        <SignOutButton />
      </nav>
    </header>
  );
}
