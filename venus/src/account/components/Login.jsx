import { useState, useEffect } from "react";
import axios from "axios";
import { Link, redirect, useNavigate } from "react-router-dom";
import "./Login.module.css";
import { useMutation } from "@tanstack/react-query";
import OauthButton from "./OauthButton.jsx";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const inputStyle = "w-full rounded-md p-2";
  const errorStyle = "text-red-600 text-xs p-0 m-0";
  const linkStyle = "text-blue-700 text-sm hover:underline";
  const navigate = useNavigate();

  function handleGoogleLogin() {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }

  const handleGithubLogin = async () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  useEffect(() => {
    if (username) setUsernameError("");
    if (password) setPasswordError("");
    setLoginError("");
  }, [username, password]);

  const validateUsername = () => {
    if (username === "") {
      setUsernameError("Please enter your username");
      return false;
    } else if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
      setUsernameError("Please enter a valid username");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password === "") {
      setPasswordError("Please enter your password");
      return false;
    } else if (password.length < 8) {
      setPasswordError("The password must be 8 characters or longer");
      return false;
    }
    return true;
  };

  const loginUser = (userData) => {
    return axios.post("http://localhost:8080/account/login", userData, {
      withCredentials: true,
    });
  };

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      console.log(error.response.status);
      console.log(error.response.data);

      if (error.response.status === 401) {
        setLoginError("Incorrect credentials");
      }

      console.log("Login failed!");
    },
    onSuccess: (response) => {
      console.log(response.status);
      console.log("Login successful!");
      navigate("/main-view");
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username === "") {
      setUsernameError("Please enter your username");
    }

    if (password === "") {
      setPasswordError("Please enter your password");
    }

    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (!isUsernameValid || !isPasswordValid) return;

    loginMutation.mutate({ username, password });
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
              placeholder="Username"
              className={inputStyle}
              maxLength={100}
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
              maxLength={100}
            />
            <br />
            {/*If passwordError is not empty or null then display*/}
            {passwordError && (
              <label className={errorStyle}>{passwordError}</label>
            )}
          </div>
          <br />

          <div className={"remember-forgot flex justify-between"}>
            <Link to="/login/forgot-password" className={linkStyle}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
            disabled={loginMutation.isLoading}
          >
            Log In
          </button>
          {loginError && <label className={errorStyle}>{loginError}</label>}

          <div className="register-link flex">
            <p className="text-sm">Don&apos;t have an account?&nbsp;</p>
            <Link to="/register" className={linkStyle}>
              Register
            </Link>
          </div>
          <div>
            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-96 h-px my-8 bg-gray-700 border-0" />
              <span className="uppercase text-lg -translate-x-1/2 absolute bg-amber-100 left-1/2 px-2 font-bold">
                or
              </span>
            </div>
          </div>
        </form>
        <OauthButton onClick={handleGoogleLogin}>
          <FcGoogle className="mr-3" size={25} />
          Continue with Google account.
        </OauthButton>
        <OauthButton onClick={handleGithubLogin}>
          <FaGithub className="mr-3" size={25} />
          Continue with Github account.
        </OauthButton>
      </div>
    </div>
  );
}

export default Login;
