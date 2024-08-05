import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [error, setError] = useState();

  const handleSubmit = (event) => {
    //Prevents website from reloading
    event.preventDefault();

    if (username === "") {
      setEmailError("Please enter your username");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
      setEmailError("Please enter a valid username");
      return;
    }

    if (password === "") {
      setPasswordError("Please enter your password");
      return;
    }

    if (password.length < 8) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }
  };

  return (
    <div className="wrapper bg-amber-100 rounded-xl p-5 flex">
      <form onSubmit={handleSubmit}>
        <h1 className="text-center text-xl font-bold mb-5">Welcome Back!</h1>
        <div className="input-box text-sm font-medium text-gray-900 dark:text-black">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Email"
            className="w-full"
          />
          <br />
          <label className="error-message text-red-600 p-0 m-0">
            {emailError}
          </label>
        </div>
        <br />

        <div className="input-box text-sm font-medium text-gray-900 dark:text-black">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full"
          />
          <br />
          <label className="error-message text-red-600 p-0 m-0">
            {passwordError}
          </label>
        </div>
        <br />

        <div className={"remember-forgot flex justify-between"}>
          <label className="text-sm">
            <input type="checkbox" />
            Remember me
          </label>
          {/*<Link to="">Forgot Password?</Link>*/}
          <a href="" className="text-blue-700 text-sm underline">
            Forgot Password?
          </a>
        </div>

        <button type="submit" className="bg-black text-white rounded-xl w-full">
          Log In
        </button>

        <div className="register-link justify-between">
          <p className="">
            Don't have an account?
            {/*<Link to="">Register</Link>*/}
            <a href="" className="text-blue-700 underline">
              Register
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
