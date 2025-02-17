import Input from "../../components/form/Input.jsx";
import { registerUser } from "../../http/account.js";
import { useMutation } from "@tanstack/react-query";
import FormContainer from "../../components/form/FormContainer.jsx";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import { useEffect } from "react";
import { accountAction } from "../../redux/account.jsx";
import { useDispatch } from "react-redux";

export default function Register() {
  const { mutate, isSuccess, error } = useMutation({
    mutationFn: registerUser,
  });

  const dispatch = useDispatch();

  const { enteredValue, didEdit, isValid, handleInputChange, handleInputBlur } =
    useUserDataValidation({
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
      showOauth={true}
      showLink={true}
      notificationMessage="Account created successfully!"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          id="username"
          onChange={(event) => handleInputChange("username", event)}
          value={enteredValue.username}
          onBlur={() => handleInputBlur("username")}
          isValid={isValid.username}
        />
        <Input
          label="E-mail"
          type="email"
          id="email"
          onChange={(event) => handleInputChange("email", event)}
          value={enteredValue.email}
          onBlur={() => handleInputBlur("email")}
          isValid={isValid.email}
        />
        <Input
          label="Password"
          type="password"
          id="password"
          onChange={(event) => handleInputChange("password", event)}
          value={enteredValue.password}
          onBlur={() => handleInputBlur("password")}
          isValid={isValid.password}
        />
        <Input
          label="Confirm Password"
          type="password"
          id="confirm-password"
          onChange={(event) => handleInputChange("confirm-password", event)}
          value={enteredValue["confirm-password"]}
          onBlur={() => handleInputBlur("confirm-password")}
          isValid={isValid["confirm-password"]}
        />
        <button
          type="submit"
          className="bg-mainBlue p-3 mt-3 dark:text-darkText rounded-md text-lg"
          disabled={
            !didEdit.username ||
            !didEdit.password ||
            !didEdit.email ||
            !didEdit["confirm-password"] ||
            !isValid.email.value ||
            !isValid.password.value ||
            !isValid.username.value ||
            !isValid["confirm-password"].value
          }
        >
          Sign up
        </button>
      </form>
    </FormContainer>
  );
}
