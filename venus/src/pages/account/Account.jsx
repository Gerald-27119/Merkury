import { Link } from "react-router-dom";
import Button from "./Button.jsx";

export default function Account() {
  const buttonClasses =
    "text-4xl p-3 bg-gradient-to-r from-purple-500  to-teal-500 hover:to-purple-600  hover:from-teal-600 duration-600 justify-center rounded text-center align-middle leading-normal text-fuchsia-50 transition-all delay-200 ease-in-out";
  return (
    <div className="bg-[url('/bg-kapi2.png')] bg-cover bg-center bg-no-repeat flex h-screen w-full items-center justify-center space-x-8">
      <Link to="/login">
        <Button classNames={buttonClasses}>Login</Button>
      </Link>
      <Link to="/register">
        <Button classNames={buttonClasses}>Register</Button>
      </Link>
    </div>
  );
}
