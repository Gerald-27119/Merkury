import Input from "../../components/Input.jsx";
import { registerUser } from "../../http/account.js";
import { useMutation } from "@tanstack/react-query";
import FormContainer from "../../components/FormContainer.jsx";
import Button from "../account/Button.jsx";
import useValidation from "../../hooks/useValidation.jsx";
import { useEffect } from "react";
import { accountAction } from "../../redux/account.jsx";
import { useDispatch } from "react-redux";

export default function Register() {
  const { mutate, isSuccess, error } = useMutation({
    mutationFn: registerUser,
  });

  const dispatch = useDispatch();

  const {
    enteredValue,
    didEdit,
    isNotValid,
    handleInputChange,
    handleInputBlur,
  } = useValidation({
    password: "",
    username: "",
    email: "",
    "confirm-password": "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    mutate({
      username: enteredValue.username,
      email: enteredValue.email,
      password: enteredValue.password,
    });
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(accountAction.setIsLogged({ username: enteredValue.username }));
    }
  }, [isSuccess, dispatch, enteredValue.username]);

  return (
    <FormContainer
      isSuccess={isSuccess}
      error={error}
      navigateTo="/login"
      linkCaption="Already have an account?"
      header="Create Account"
      navigateOnSuccess="/"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          id="username"
          onChange={(event) => handleInputChange("username", event)}
          value={enteredValue.username}
          onBlur={() => handleInputBlur("username")}
          error={isNotValid.username}
        />
        <Input
          label="E-mail"
          type="email"
          id="email"
          onChange={(event) => handleInputChange("email", event)}
          value={enteredValue.email}
          onBlur={() => handleInputBlur("email")}
          error={isNotValid.email}
        />
        <Input
          label="Password"
          type="password"
          id="password"
          onChange={(event) => handleInputChange("password", event)}
          value={enteredValue.password}
          onBlur={() => handleInputBlur("password")}
          error={isNotValid.password}
        />
        <Input
          label="Confirm Password"
          type="password"
          id="confirm-password"
          onChange={(event) => handleInputChange("confirm-password", event)}
          value={enteredValue["confirm-password"]}
          onBlur={() => handleInputBlur("confirm-password")}
          error={isNotValid["confirm-password"]}
        />
        <Button
          type="submit"
          classNames="bg-red-600 p-3 mt-3 text-white rounded-md text-lg"
          disabled={
            !didEdit.username ||
            !didEdit.password ||
            !didEdit.email ||
            !didEdit["confirm-password"] ||
            isNotValid.email.value ||
            isNotValid.password.value ||
            isNotValid.username.value ||
            isNotValid["confirm-password"].value
          }
        >
          Sign up
        </Button>
      </form>
    </FormContainer>
  );
}
