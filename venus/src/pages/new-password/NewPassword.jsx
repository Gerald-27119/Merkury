import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { changePassword } from "../../http/account.js";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import FormContainer from "../../components/form/FormContainer.jsx";
import Input from "../../components/form/Input.jsx";

export default function NewPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { enteredValue, didEdit, isValid, handleInputChange, handleInputBlur } =
    useUserDataValidation({ password: "", "confirm-password": "" });

  const { isSuccess, error, mutate } = useMutation({
    mutationFn: changePassword,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    mutate({ token, password: enteredValue.password });
  };

  return (
    <FormContainer
      header="Set new Password"
      isSuccess={isSuccess}
      error={error}
      navigateOnSuccess="/login"
      notificationMessage="New password set successfully!"
    >
      <form onSubmit={handleSubmit}>
        <Input
          id="password"
          value={enteredValue.password}
          onChange={(event) => handleInputChange("password", event)}
          onBlur={() => handleInputBlur("password")}
          type="password"
          isValid={isValid?.password}
          label="new password"
        />
        <Input
          id="confirm-password"
          value={enteredValue["confirm-password"]}
          onChange={(event) => handleInputChange("confirm-password", event)}
          onBlur={() => handleInputBlur("confirm-password")}
          type="password"
          isValid={isValid["confirm-password"]}
          label="confirm password"
        />
        <button
          type="submit"
          className="bg-black text-white rounded-md w-full p-1 mx-1 my-2"
          disabled={
            !didEdit.password ||
            !didEdit["confirm-password"] ||
            !isValid.password.value ||
            !isValid["confirm-password"].value
          }
        >
          Set Password
        </button>
      </form>
    </FormContainer>
  );
}
