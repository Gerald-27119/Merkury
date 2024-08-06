import Input from "./Input.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  isEmail,
  isEqualsToOtherValue,
  isPassword,
  isUsername,
} from "../regex.js";
import { fetchRegistration } from "../http.js";

export default function Registration() {
  const classesInput = "p-2 w-96 rounded-md";
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

  const isValid = {
    username: {
      value: didEdit.username && !isUsername(enteredValue.username),
      message: "Username must contain 3 to 16.",
    },
    email: {
      value: didEdit.email && !isEmail(enteredValue.email),
      message: "E-mail must contain @.",
    },
    password: {
      value: didEdit.password && !isPassword(enteredValue.password),
      message:
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
      message: !isPassword(enteredValue["confirm-password"])
        ? "Password must be minimum 8 long."
        : !isEqualsToOtherValue(
            enteredValue["confirm-password"],
            enteredValue.password,
          ) && "Passwords must be the same",
    },
  };

  function handleSubmit(event) {
    event.preventDefault();
    fetchRegistration({
      username: enteredValue.username,
      email: enteredValue.email,
      password: enteredValue.password,
    });
    console.log(enteredValue);
  }

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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="Username"
            type="text"
            id="username"
            onChange={(event) => handleInputChange("username", event)}
            value={enteredValue.username}
            onBlur={() => handleInputBlur("username")}
            className={classesInput}
            error={isValid.username}
          />
          <Input
            label="E-mail"
            type="email"
            id="email"
            onChange={(event) => handleInputChange("email", event)}
            value={enteredValue.email}
            onBlur={() => handleInputBlur("email")}
            className={classesInput}
            error={isValid.email}
          />
          <Input
            label="Password"
            type="password"
            id="password"
            onChange={(event) => handleInputChange("password", event)}
            value={enteredValue.password}
            onBlur={() => handleInputBlur("password")}
            className={classesInput}
            error={isValid.password}
          />
          <Input
            label="Confirm Password"
            type="password"
            id="confirm-password"
            onChange={(event) => handleInputChange("confirm-password", event)}
            value={enteredValue["confirm-password"]}
            onBlur={() => handleInputBlur("confirm-password")}
            className={classesInput}
            error={isValid["confirm-password"]}
          />
          <button className="bg-red-600 p-3 mt-3 text-white rounded-md text-lg">
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
