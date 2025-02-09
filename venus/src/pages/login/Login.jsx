import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Input from "../../components/Input.jsx";
import { loginUser } from "../../http/account.js";
import FormContainer from "../../components/FormContainer.jsx";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import { useDispatch } from "react-redux";
import { accountAction } from "../../redux/account.jsx";
import { useEffect } from "react";

function Login() {
  const dispatch = useDispatch();

  const { mutate, isSuccess, error } = useMutation({
    mutationFn: loginUser,
  });

  const { enteredValue, didEdit, isValid, handleInputChange, handleInputBlur } =
    useUserDataValidation({ username: "", password: "" }, false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    mutate({
      username: enteredValue.username,
      password: enteredValue.password,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(accountAction.setIsLogged({ username: enteredValue.username }));
    }
  }, [isSuccess, dispatch, enteredValue.username]);

  return (
    <FormContainer
      error={error}
      isSuccess={isSuccess}
      navigateTo="/register"
      linkCaption="Don't have an account?"
      header="Sign in"
      navigateOnSuccess="/"
      showOauth={true}
      showLink={true}
      notificationMessage="Signed in successfully!"
    >
      <form onSubmit={handleSubmit}>
        <Input
          id="username"
          label="Username"
          value={enteredValue.username}
          onBlur={() => handleInputBlur("username")}
          onChange={(event) => handleInputChange("username", event)}
          type="text"
          isValid={isValid?.username}
        />
        <Input
          id="password"
          value={enteredValue.password}
          label="password"
          onBlur={() => handleInputBlur("password")}
          onChange={(event) => handleInputChange("password", event)}
          type="password"
          isValid={isValid?.password}
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
        <button
          type="submit"
          className="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
          disabled={
            !didEdit.username ||
            !didEdit.password ||
            !isValid.password.value ||
            !isValid.username.value
          }
        >
          Sign In
        </button>
      </form>
    </FormContainer>
  );
}

export default Login;
