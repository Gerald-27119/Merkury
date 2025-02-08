import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const buttonClasses =
  "text-4xl p-3 bg-gradient-to-r from-purple-500  to-teal-500 hover:to-purple-600  hover:from-teal-600 duration-600 justify-center rounded text-center align-middle leading-normal text-fuchsia-50 transition-all delay-200 ease-in-out";

export default function Account() {
  const isLogged = useSelector((state) => state.account.isLogged);

  return (
    <div className="bg-[url('/bg-kapi.png')] bg-cover bg-center bg-no-repeat flex h-screen w-full items-center justify-center space-x-8">
      {!isLogged && (
        <Link to="/login">
          <button className={buttonClasses}>Login</button>
        </Link>
      )}
      {!isLogged && (
        <Link to="/register">
          <button className={buttonClasses}>Register</button>
        </Link>
      )}
      {isLogged && (
        <Link to="/edit-data">
          <button className={buttonClasses}>Edit data</button>
        </Link>
      )}
      {isLogged && (
        <Link to="/favourite-spots">
          <button className={buttonClasses}>Favourite spots</button>
        </Link>
      )}
    </div>
  );
}
