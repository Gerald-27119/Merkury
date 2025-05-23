import { useMutation } from "@tanstack/react-query";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import FormContainer from "../../components/form/FormContainer.tsx";
import FormInput from "../../components/form/FormInput.tsx";
import { sentEmailWithNewPasswordLink } from "../../http/account.js";

export default function ForgotPassword() {
  const { mutate, isSuccess, error } = useMutation({
    mutationFn: sentEmailWithNewPasswordLink,
  });

  const { enteredValue, didEdit, isValid, handleInputChange, handleInputBlur } =
    useUserDataValidation({ email: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();

    mutate(enteredValue.email);
  };

  return (
    <FormContainer
      isSuccess={isSuccess}
      error={error}
      header="Forgot your password?"
      notificationMessage="Reminder email sent!"
    >
      <form onSubmit={handleSubmit}>
        <FormInput
          id="email"
          value={enteredValue.email}
          onBlur={() => handleInputBlur("email")}
          onChange={(event) => handleInputChange("email", event)}
          type="email"
          isValid={isValid?.email}
          label="email"
        />
        <button
          type="submit"
          className="m-1 mt-2 mb-2 w-full rounded-lg bg-black p-1 text-white"
          disabled={!didEdit.email || !isValid.email.value}
        >
          Remind me
        </button>
      </form>
    </FormContainer>
  );
}
