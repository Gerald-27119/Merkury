import FormInput from "../../components/form/FormInput";
import { registerUser } from "../../http/account.js";
import { useMutation } from "@tanstack/react-query";
import FormContainer from "../../components/form/FormContainer";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import { FormEvent, useEffect } from "react";
import { accountAction } from "../../redux/account.jsx";
import { inputs } from "../../utils/account/inputsList";
import SubmitFormButton from "../../components/form/SubmitFormButton";
import useDispatchTyped from "../../hooks/useDispatchTyped";

const signUpFields = ["username", "password", "email", "confirm-password"];

export default function Register() {
  const { mutateAsync, isSuccess, error } = useMutation({
    mutationFn: registerUser,
  });

  const dispatch = useDispatchTyped();

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
            key={id}
            label={name}
            type={type}
            id={id}
            onChange={(event) => handleInputChange(id, event)}
            value={enteredValue[id]}
            onBlur={() => handleInputBlur(id)}
            isValid={isValid[id]}
          />
        ))}
        <SubmitFormButton
          label="Sign up"
          fields={signUpFields}
          didEdit={didEdit}
          isValid={isValid}
        />
      </form>
    </FormContainer>
  );
}
