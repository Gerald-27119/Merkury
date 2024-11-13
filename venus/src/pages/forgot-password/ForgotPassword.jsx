import { useMutation } from "@tanstack/react-query";
import useValidation from "../../hooks/useValidation.jsx";
import Button from "../account/Button.jsx";
import FormContainer from "../../components/FormContainer.jsx";
import Input from "../../components/Input.jsx";
import { sentEmailWithNewPasswordLink } from "../../http/account.js";

export default function ForgotPassword() {
  const { enteredValue, didEdit, isValid, handleInputChange, handleInputBlur } =
    useValidation();

  const { mutate, isSuccess, error, isPending } = useMutation({
    mutationFn: sentEmailWithNewPasswordLink,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isValid.email.value && !isPending) {
      mutate(enteredValue.email);
    }
  };

  return (
    <FormContainer
      isSuccess={isSuccess}
      error={error}
      header="Forgot your password?"
      showLink={false}
      showOauth={false}
    >
      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          value={enteredValue.email}
          onBlur={() => handleInputBlur("email")}
          onChange={(event) => handleInputChange("email", event)}
          type="email"
          placeholder="Email"
          maxLength={100}
        />
        <Button
          type="submit"
          classNames="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
          disabled={isPending || !didEdit.email || !isValid.email.value}
        >
          Remind me
        </Button>
      </form>
    </FormContainer>
  );
}
