import { useMutation } from "@tanstack/react-query";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import FormContainer from "../../components/form/FormContainer.jsx";
import Input from "../../components/form/Input.jsx";
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
        <Input
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
          className="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
          disabled={!didEdit.email || !isValid.email.value}
        >
          Remind me
        </button>
      </form>
    </FormContainer>
  );
}
