import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Input from "../../components/Input.jsx";
import Button from "../account/Button.jsx";
import { loginUser } from "../../http/account.js";
import FormContainer from "../../components/FormContainer.jsx";
import useValidation from "../../hooks/useValidation.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { accountAction } from "../../redux/account.jsx";

function Login() {
  const dispatch = useDispatch();

  const { mutate, isSuccess, error } = useMutation({
    mutationFn: loginUser,
  });

  const {
    enteredValue,
    didEdit,
    isNotValid,
    handleInputChange,
    handleInputBlur,
  } = useValidation({ username: "", password: "" }, false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    mutate({
      username: enteredValue.username,
      password: enteredValue.password,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(accountAction.setIsLogged());
    }
  }, [dispatch, isSuccess]);

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
          error={isNotValid?.username}
        />
        <Input
          id="password"
          value={enteredValue.password}
          label="password"
          onBlur={() => handleInputBlur("password")}
          onChange={(event) => handleInputChange("password", event)}
          type="password"
          error={isNotValid?.password}
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
            isNotValid.password.value ||
            isNotValid.username.value
          }
        >
          Sign In
        </Button>
      </form>
    </FormContainer>
  );
}

export default Login;
