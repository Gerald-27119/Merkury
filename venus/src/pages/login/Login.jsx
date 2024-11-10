import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import OauthForm from "../../components/oauth/OauthForm.jsx";
import Input from "../../components/Input.jsx";
import Button from "../account/Button.jsx";
import {
  isNotEmpty,
  isPassword,
  isUsername,
} from "../../validation/validator.js";

function Login() {
  const [enteredValue, setEnteredValue] = useState({
    username: "",
    password: "",
  });

  const [didEdit, setDidEdit] = useState({
    username: false,
    password: false,
  });

  const loginUser = (userData) => {
    return axios.post("http://localhost:8080/account/login", userData, {
      withCredentials: true,
    });
  };

  const { mutate, isSuccess, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      setEnteredValue({
        username: "",
        password: "",
      });
      setDidEdit({
        username: false,
        password: false,
      });
    },
  });

  const isValid = {
    username: {
      value: didEdit.username && !isUsername(enteredValue.username),
      message: !isNotEmpty(enteredValue.username)
        ? "Username can't be empty."
        : !isUsername(enteredValue.username) &&
          "Username must contain 3 to 16.",
    },
    password: {
      value: didEdit.password && !isPassword(enteredValue.password),
      message: !isNotEmpty(enteredValue.password)
        ? "Password can't be empty."
        : !isPassword(enteredValue.password) &&
          "Password must be minimum 8 long, contains small letter, big letter, number and special char.",
    },
  };

  function handleInputChange(id, event) {
    setEnteredValue((prevState) => ({
      ...prevState,
      [id]: event.target.value,
    }));
  }

  function handleInputBlur(id) {
    setDidEdit((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    mutate({
      username: enteredValue.username,
      password: enteredValue.password,
    });
  };

  return (
    <div className="h-screen items-center justify-center flex bg-[url('https://support.discord.com/hc/article_attachments/22839154408087')] bg-cover bg-center">
      <div className="wrapper bg-amber-100 rounded-xl p-4 flex flex-col">
        <h1 className="text-center text-2xl font-bold mr-7 ml-7 mb-5">
          Welcome Back!
        </h1>
        {isSuccess && (
          <p className="text-center text-xl text-gray-600">Account created!</p>
        )}
        {error === 409 && (
          <p className="text-center text-xl text-red-600">
            E-mail or Username already taken.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-box text-sm font-medium text-gray-900 dark:text-black">
            <Input
              id="username"
              label="Username"
              value={enteredValue.username}
              onBlur={() => handleInputBlur("username")}
              onChange={(event) => handleInputChange("username", event)}
              type="text"
              placeholder="Username"
              maxLength={100}
              error={isValid.username}
            />
          </div>
          <div className="input-box text-sm font-medium text-gray-900 dark:text-black">
            <Input
              id="password"
              value={enteredValue.password}
              label="password"
              onBlur={() => handleInputBlur("password")}
              onChange={(event) => handleInputChange("password", event)}
              type="password"
              placeholder="Password"
              maxLength={100}
              error={isValid.password}
            />
          </div>
          <div className={"remember-forgot flex justify-between"}>
            <Link
              to="/login/forgot-password"
              className="text-blue-700 text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            classNames="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
            disabled={
              !didEdit.username ||
              !didEdit.password ||
              isValid.password.value ||
              isValid.username.value
            }
          >
            Sign In
          </Button>
          <div className="register-link flex">
            <p className="text-sm">Don&apos;t have an account?&nbsp;</p>
            <Link
              to="/register"
              className={"text-blue-700 text-sm hover:underline"}
            >
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
        <OauthForm />
      </div>
    </div>
  );
}

export default Login;
