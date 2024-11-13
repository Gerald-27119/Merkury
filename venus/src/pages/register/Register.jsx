import Input from "../../components/Input.jsx";
import { useState } from "react";
import {
  isEmail,
  isEqualsToOtherValue,
  isNotEmpty,
  isPassword,
  isUsername,
} from "../../validation/validator.js";
import { registerUser } from "../../http/account.js";
import { useMutation } from "@tanstack/react-query";
import FormContainer from "../../components/FormContainer.jsx";
import Button from "../account/Button.jsx";

export default function Register() {
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

  const { mutate, isSuccess, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setEnteredValue({
        username: "",
        password: "",
        "confirm-password": "",
        email: "",
      });
      setDidEdit({
        username: false,
        password: false,
        "confirm-password": false,
        email: false,
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
      message: !isNotEmpty(enteredValue.password)
        ? "Password can't be empty."
        : !isEqualsToOtherValue(
            enteredValue["confirm-password"],
            enteredValue.password,
          ) && "Passwords must be the same",
    },
  };

  function handleSubmit(event) {
    event.preventDefault();
    mutate({
      username: enteredValue.username,
      email: enteredValue.email,
      password: enteredValue.password,
    });
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
    <FormContainer
      isSuccess={isSuccess}
      error={error}
      navigateTo="/login"
      linkCaption="Already have an account?"
    >
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
        <Button
          type="submit"
          classNames="bg-red-600 p-3 mt-3 text-white rounded-md text-lg"
          disabled={
            !didEdit.username ||
            !didEdit.password ||
            !didEdit.email ||
            !didEdit["confirm-password"] ||
            isValid.email.value ||
            isValid.password.value ||
            isValid.username.value ||
            isValid["confirm-password"].value
          }
        >
          Sign up
        </Button>
      </form>
    </FormContainer>
  );
}
