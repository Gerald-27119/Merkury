import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const inputStyle = "w-full rounded-md p-2";
  const errorStyle = "text-red-600 text-xs p-0 m-0";
  const linkStyle = "text-blue-700 text-sm hover:underline";

  useEffect(() => {
    if (username) setUsernameError("");
    if (password) setPasswordError("");
    setError("");
  }, [username, password]);

  const validateUsername = () => {
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
      setUsernameError("Please enter a valid username");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("The password must be 8 characters or longer");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username === "") {
      setUsernameError("Please enter your username");
    }

    if (password === "") {
      setPasswordError("Please enter your password");
    }

    try {
      const response = await axios.post("http://localhost:8080/account/login", {
        username,
        password,
      });
      console.log("PRZESZŁO");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="h-screen items-center justify-center flex bg-[url('https://support.discord.com/hc/article_attachments/22839154408087')] bg-cover bg-center h-screen">
      <div className="wrapper bg-amber-100 rounded-xl p-4 flex flex-col">
        <form onSubmit={handleSubmit}>
          <h1 className="text-center text-2xl font-bold mr-7 ml-7 mb-5">
            Welcome Back!
          </h1>
          <div className="input-box text-sm font-medium text-gray-900 dark:text-black">
            <input
              value={username}
              onBlur={validateUsername}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Email"
              className={inputStyle}
            />
            <br />
            {/*If Error is not empty or null then display*/}
            {usernameError && (
              <label className={errorStyle}>{usernameError}</label>
            )}
          </div>
          <br />

          <div className="input-box text-sm font-medium text-gray-900 dark:text-black">
            <input
              value={password}
              onBlur={validatePassword}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className={inputStyle}
            />
            <br />
            {/*If passwordError is not empty or null then display*/}
            {passwordError && (
              <label className={errorStyle}>{passwordError}</label>
            )}
          </div>
          <br />

          <div className={"remember-forgot flex justify-between"}>
            <Link to="/" className={linkStyle}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
          >
            Log In
          </button>

          <div className="register-link flex">
            <p className="text-sm">Don't have an account?&nbsp;</p>
            <Link to="/registration" className={linkStyle}>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
