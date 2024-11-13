import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Input from "../../components/Input.jsx";
import Button from "../account/Button.jsx";
import { loginUser } from "../../http/account.js";
import FormContainer from "../../components/FormContainer.jsx";
import useValidation from "../../hooks/useValidation.jsx";

function Login() {
  const { mutate, isSuccess, error } = useMutation({
    mutationFn: loginUser,
  });

  const { enteredValue, didEdit, isValid, handleInputChange, handleInputBlur } =
    useValidation({ username: "", password: "" });

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
      header="Sign in"
      navigateOnSuccess="/"
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
          error={isValid?.username}
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
          error={isValid?.password}
          required={true}
        />
        <div className={"remember-forgot flex justify-between"}>
          <Link
            to="/forgot-password"
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
