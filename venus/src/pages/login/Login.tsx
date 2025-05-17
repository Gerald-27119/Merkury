import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import FormInput from "../../components/form/FormInput";
import { loginUser } from "../../http/account.js";
import FormContainer from "../../components/form/FormContainer";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import { useDispatch } from "react-redux";
import { accountAction } from "../../redux/account.jsx";
import { FormEvent, useEffect } from "react";
import { inputs } from "../../utils/account/inputsList";

function Login() {
  const dispatch = useDispatch();

  const { mutateAsync, isSuccess, error } = useMutation({
    mutationFn: loginUser,
  });

  const { enteredValue, didEdit, isValid, handleInputChange, handleInputBlur } =
    useUserDataValidation({ username: "", password: "" }, false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync({
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[inputs[0], inputs[2]].map(({ name, type, id }) => (
          <FormInput
            key={id ?? name}
            label={name}
            type={type}
            id={id ?? name}
            onChange={(event) => handleInputChange(id ?? name, event)}
            value={enteredValue[id ?? name]}
            onBlur={() => handleInputBlur(id ?? name)}
            isValid={isValid[id ?? name]}
          />
        ))}
        <div className={"remember-forgot flex justify-between"}>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          className="bg-mainBlue text-darkText hover:bg-mainBlueDarker mt-3 w-full rounded-lg p-3"
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
