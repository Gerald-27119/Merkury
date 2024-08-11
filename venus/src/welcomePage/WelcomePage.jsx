import Button from "./Button.jsx";
import { Link } from "react-router-dom";

export default function WelcomePage() {
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
