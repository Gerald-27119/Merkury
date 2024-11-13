import Input from "../../components/Input.jsx";
import { registerUser } from "../../http/account.js";
import { useMutation } from "@tanstack/react-query";
import FormContainer from "../../components/FormContainer.jsx";
import Button from "../account/Button.jsx";
import useValidation from "../../hooks/useValidation.jsx";

export default function Register() {
  const { mutate, isSuccess, error } = useMutation({
    mutationFn: registerUser,
    // onSuccess: () => {
    //   setEnteredValue({
    //     username: "",
    //     password: "",
    //     "confirm-password": "",
    //     email: "",
    //   });
    //   setDidEdit({
    //     username: false,
    //     password: false,
    //     "confirm-password": false,
    //     email: false,
    //   });
    // },
  });

  const { enteredValue, didEdit, isValid, handleInputChange, handleInputBlur } =
    useValidation({
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
