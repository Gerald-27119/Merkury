import { Link } from "react-router-dom";
import Button from "./Button.jsx";

export default function Account() {
  return (
    <div className="background-image flex h-screen w-full items-center justify-center space-x-8">
      <Link to="/login">
        <Button>Login</Button>
      </Link>
      <Link to="/register">
        <Button>Register</Button>
      </Link>
    </div>
  );
}
