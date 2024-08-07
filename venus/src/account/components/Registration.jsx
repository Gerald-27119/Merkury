import Input from "./Input.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  isEmail,
  isEqualsToOtherValue,
  isNotEmpty,
  isPassword,
  isUsername,
} from "../regex.js";
import { fetchRegistration } from "../http.js";
import { useMutation } from "@tanstack/react-query";

export default function Registration() {
  const [enteredValue, setEnteredValue] = useState({
    username: "",
    password: "",
    "confirm-password": "",
    email: "",
  });

  const [didEdit, setDidEdit] = useState({
    username: false,
    password: false,
    "confirm-password": false,
    email: false,
  });

  const { mutate, status } = useMutation({
    mutationFn: fetchRegistration,
  });

  let confirmPasswordMessage = "";
  if (!isNotEmpty(enteredValue["confirm-password"])) {
    confirmPasswordMessage = "Confirm password can't be empty.";
  } else if (!isPassword(enteredValue["confirm-password"])) {
    confirmPasswordMessage = "Password must be minimum 8 long.";
  } else if (
    !isEqualsToOtherValue(
      enteredValue["confirm-password"],
      enteredValue.password,
    )
  ) {
    confirmPasswordMessage = "Passwords must be the same";
  }

  const isValid = {
    username: {
      value: didEdit.username && !isUsername(enteredValue.username),
      message: !isNotEmpty(enteredValue.username)
        ? "Username can't be empty."
        : !isUsername(enteredValue.username) &&
          "Username must contain 3 to 16.",
    },
    email: {
      value: didEdit.email && !isEmail(enteredValue.email),
      message: !isNotEmpty(enteredValue.email)
        ? "E-mail can't be empty."
        : !isEmail(enteredValue.email) && "E-mail must contain @.",
    },
    password: {
      value: didEdit.password && !isPassword(enteredValue.password),
      message: !isNotEmpty(enteredValue.password)
        ? "Password can't be empty."
        : !isPassword(enteredValue.password) &&
          "Password must be minimum 8 long, contains small letter, big letter, number and special char.",
    },
    "confirm-password": {
      value:
        didEdit["confirm-password"] &&
        (!isPassword(enteredValue["confirm-password"]) ||
          !isEqualsToOtherValue(
            enteredValue["confirm-password"],
            enteredValue.password,
          )),
      message: confirmPasswordMessage,
    },
  };
  console.log(status);
  function handleSubmit(event) {
    event.preventDefault();
    mutate({
      username: enteredValue.username,
      email: enteredValue.email,
      password: enteredValue.password,
    });
    console.log(status);
  }
  console.log(status);
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

  return (
    <div className="h-screen bg-amber-100 flex items-center justify-center">
      <div className="bg-amber-400 w-[30rem] rounded-md px-10 py-8 flex flex-col">
        <h1 className="text-center text-2xl text-white font-bold pb-8">
          Create account
        </h1>
        {status === "success" && (
          <p className="text-center text-xl text-white">Account created!</p>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="Username"
            type="text"
            id="username"
            onChange={(event) => handleInputChange("username", event)}
            value={enteredValue.username}
            onBlur={() => handleInputBlur("username")}
            error={isValid.username}
          />
          <Input
            label="E-mail"
            type="email"
            id="email"
            onChange={(event) => handleInputChange("email", event)}
            value={enteredValue.email}
            onBlur={() => handleInputBlur("email")}
            error={isValid.email}
          />
          <Input
            label="Password"
            type="password"
            id="password"
            onChange={(event) => handleInputChange("password", event)}
            value={enteredValue.password}
            onBlur={() => handleInputBlur("password")}
            error={isValid.password}
          />
          <Input
            label="Confirm Password"
            type="password"
            id="confirm-password"
            onChange={(event) => handleInputChange("confirm-password", event)}
            value={enteredValue["confirm-password"]}
            onBlur={() => handleInputBlur("confirm-password")}
            error={isValid["confirm-password"]}
          />
          <button
            className="bg-red-600 p-3 mt-3 text-white rounded-md text-lg"
            disabled={
              isValid.email.value ||
              isValid.password.value ||
              isValid.username.value ||
              isValid["confirm-password"].value
            }
          >
            Sign up
          </button>
        </form>
        <Link
          to="/login"
          className="text-sm hover:underline pt-8 text-gray-600"
        >
          Already have an account?
        </Link>
      </div>
    </div>
  );
}
