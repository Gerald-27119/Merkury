import { Link } from "react-router-dom";
import Button from "./Button.jsx";

export default function Account() {
  const buttonClasses = "text-4xl p-3";
  return (
    <div className="background-image flex h-screen w-full items-center justify-center space-x-8">
      <Link to="/login">
        <Button classNames={buttonClasses}>Login</Button>
      </Link>
      <Link to="/register">
        <Button classNames={buttonClasses}>Register</Button>
      </Link>
    </div>
  );
}
