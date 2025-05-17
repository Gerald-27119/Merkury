import FormInput from "../../components/form/FormInput";
import { registerUser } from "../../http/account.js";
import { useMutation } from "@tanstack/react-query";
import FormContainer from "../../components/form/FormContainer";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import { FormEvent, useEffect } from "react";
import { accountAction } from "../../redux/account.jsx";
import { useDispatch } from "react-redux";
import { inputs } from "../../utils/account/inputsList";

export default function Register() {
  const { mutateAsync, isSuccess, error } = useMutation({
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync({
      username: enteredValue.username,
      email: enteredValue.email,
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
        {inputs.map(({ name, type, id }) => (
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
        <button
          type="submit"
          className="bg-mainBlue text-darkText hover:bg-mainBlueDarker mt-3 rounded-md p-3 text-lg"
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
