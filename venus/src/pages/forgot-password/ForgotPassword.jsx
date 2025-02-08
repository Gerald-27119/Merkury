import { useMutation } from "@tanstack/react-query";
import useValidation from "../../hooks/useValidation.jsx";
import FormContainer from "../../components/FormContainer.jsx";
import Input from "../../components/Input.jsx";
import { sentEmailWithNewPasswordLink } from "../../http/account.js";

export default function ForgotPassword() {
  const { mutate, isSuccess, error } = useMutation({
    mutationFn: sentEmailWithNewPasswordLink,
  });

  const {
    enteredValue,
    didEdit,
    isNotValid,
    handleInputChange,
    handleInputBlur,
  } = useValidation({ email: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();

    mutate(enteredValue.email);
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
          error={isNotValid?.email}
          label="email"
        />
        <button
          type="submit"
          className="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
          disabled={!didEdit.email || isNotValid.email.value}
        >
          Remind me
        </button>
      </form>
    </FormContainer>
  );
}
