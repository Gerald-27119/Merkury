import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import FormInput from "../../components/form/FormInput";
import { loginUser } from "../../http/account.js";
import FormContainer from "../../components/form/FormContainer";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import { accountAction } from "../../redux/account";
import { FormEvent, useEffect } from "react";
import { inputs } from "../../utils/account/inputsList";
import SubmitFormButton from "../../components/form/SubmitFormButton";
import useDispatchTyped from "../../hooks/useDispatchTyped";

const signInFields = ["username", "password"];

function Login() {
    const dispatch = useDispatchTyped();
    const navigate = useNavigate();

    const { mutateAsync, isSuccess, error } = useMutation({
        mutationFn: loginUser,
    });

    const {
        enteredValue,
        didEdit,
        isValid,
        handleInputChange,
        handleInputBlur,
    } = useUserDataValidation({ username: "", password: "" }, false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await mutateAsync({
            username: enteredValue.username,
            password: enteredValue.password,
        });
        navigate(-1);
    };

    useEffect(() => {
        if (isSuccess) {
            dispatch(accountAction.setIsLogged());
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
                <div className={"flex justify-between"}>
                    <Link
                        to="/forgot-password"
                        className="text-sm text-blue-700 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>
                <SubmitFormButton
                    label="sign in"
                    fields={signInFields}
                    didEdit={didEdit}
                    isValid={isValid}
                />
            </form>
        </FormContainer>
    );
}

export default Login;
