import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Input from "../../components/Input.jsx";
import Button from "../account/Button.jsx";
import {
  isNotEmpty,
  isPassword,
  isUsername,
} from "../../validation/validator.js";
import { loginUser } from "../../http/account.js";
import FormContainer from "../../components/FormContainer.jsx";

function Login() {
  const [enteredValue, setEnteredValue] = useState({
    username: "",
    password: "",
  });

  const [didEdit, setDidEdit] = useState({
    username: false,
    password: false,
  });

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
    <FormContainer
      error={error}
      isSuccess={isSuccess}
      navigateTo="/register"
      linkCaption="Don't have an account?"
    >
      <form onSubmit={handleSubmit}>
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
      </form>
    </FormContainer>
  );
}

export default Login;
