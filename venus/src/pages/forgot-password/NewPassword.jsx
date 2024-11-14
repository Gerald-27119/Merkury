import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { changePassword } from "../../http/account.js";
import useValidation from "../../hooks/useValidation.jsx";
import Button from "../account/Button.jsx";
import FormContainer from "../../components/FormContainer.jsx";
import Input from "../../components/Input.jsx";

export default function NewPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    enteredValue,
    didEdit,
    isNotValid,
    handleInputChange,
    handleInputBlur,
  } = useValidation({ password: "", "confirm-password": "" });

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
      showOauth={false}
      showLink={false}
      isSuccess={isSuccess}
      error={error}
      navigateOnSuccess="/login"
    >
      <form onSubmit={handleSubmit}>
        <Input
          id="password"
          value={enteredValue.password}
          onChange={(event) => handleInputChange("password", event)}
          onBlur={() => handleInputBlur("password")}
          type="password"
          placeholder="New Password"
          maxLength={100}
          error={isNotValid?.password}
          label="new password"
        />
        <Input
          id="confirm-password"
          value={enteredValue["confirm-password"]}
          onChange={(event) => handleInputChange("confirm-password", event)}
          onBlur={() => handleInputBlur("confirm-password")}
          type="password"
          placeholder="Confirm New Password"
          maxLength={100}
          error={isNotValid["confirm-password"]}
          label="confirm password"
        />
        <Button
          type="submit"
          classNames="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
          disabled={
            !didEdit.password ||
            !didEdit["confirm-password"] ||
            isNotValid.password.value ||
            isNotValid["confirm-password"].value
          }
        >
          Set Password
        </Button>
      </form>
    </FormContainer>
  );
}
