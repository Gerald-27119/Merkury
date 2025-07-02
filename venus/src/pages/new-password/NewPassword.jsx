import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { changePassword } from "../../http/account.js";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import FormContainer from "../../components/form/FormContainer.tsx";
import FormInput from "../../components/form/FormInput.tsx";

export default function NewPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const {
        enteredValue,
        didEdit,
        isValid,
        handleInputChange,
        handleInputBlur,
    } = useUserDataValidation({ password: "", "confirm-password": "" });

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
                <FormInput
                    id="password"
                    value={enteredValue.password}
                    onChange={(event) => handleInputChange("password", event)}
                    onBlur={() => handleInputBlur("password")}
                    type="password"
                    isValid={isValid?.password}
                    label="new password"
                />
                <FormInput
                    id="confirm-password"
                    value={enteredValue["confirm-password"]}
                    onChange={(event) =>
                        handleInputChange("confirm-password", event)
                    }
                    onBlur={() => handleInputBlur("confirm-password")}
                    type="password"
                    isValid={isValid["confirm-password"]}
                    label="confirm password"
                />
                <button
                    type="submit"
                    className="mx-1 my-2 w-full rounded-md bg-black p-1 text-white"
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
