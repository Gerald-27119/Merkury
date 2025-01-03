import FormContainer from "../../components/FormContainer.jsx";
import Input from "../../components/Input.jsx";
import Button from "./Button.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editUserData, getUser } from "../../http/account.js";
import useValidation from "../../hooks/useValidation.jsx";

export default function EditUserData() {
  const {
    mutate,
    isSuccess: isMutationSuccess,
    error: mutationError,
    data: mutationData,
  } = useMutation({
    mutationFn: editUserData,
  });

  const {
    isLoading,
    data: queryData,
    isSuccess: isQuerySuccess,
    error: queryError,
  } = useQuery({
    queryKey: ["user", "user-data"],
    queryFn: () => getUser(),
    staleTime: 1000,
  });

  let userData = mutationData || queryData;
  console.log("user data: ", userData);

  const { username, email, provider, id } = userData || {
    username: "",
    email: "",
    provider: "",
    id: 0,
  };
  const isPasswordChangeable = provider === "NONE";

  const {
    enteredValue,
    didEdit,
    isNotValid,
    handleInputChange,
    handleInputBlur,
  } = useValidation(
    {
      password: "",
      username,
      email,
      "confirm-password": "",
    },
    { isPasswordChangeable },
  );

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Submitted data:", {
      id,
      user: {
        username: enteredValue.username,
        email: enteredValue.email,
        provider,
        password: enteredValue.password,
      },
    });
    mutate({
      id,
      user: {
        username: enteredValue.username,
        email: enteredValue.email,
        provider,
        password: enteredValue.password,
      },
    });
  }

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isQuerySuccess && (
        <FormContainer
          isSuccess={
            isMutationSuccess !== undefined ? isMutationSuccess : isQuerySuccess
          }
          error={mutationError !== undefined ? mutationError : queryError}
          navigateTo="/login"
          linkCaption="Already have an account?"
          header="Edit Your Data"
          navigateOnSuccess="/edit-data"
          showOauth={false}
          showLink={false}
        >
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              id="username"
              onChange={(event) => handleInputChange("username", event)}
              value={enteredValue.username}
              onBlur={() => handleInputBlur("username")}
              error={isNotValid.username}
            />
            <Input
              label="E-mail"
              type="email"
              id="email"
              onChange={(event) => handleInputChange("email", event)}
              value={enteredValue.email}
              onBlur={() => handleInputBlur("email")}
              error={isNotValid.email}
            />
            {isPasswordChangeable && (
              <>
                <Input
                  label="Password"
                  type="password"
                  id="password"
                  onChange={(event) => handleInputChange("password", event)}
                  value={enteredValue.password}
                  onBlur={() => handleInputBlur("password")}
                  error={isNotValid.password}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  onChange={(event) =>
                    handleInputChange("confirm-password", event)
                  }
                  value={enteredValue["confirm-password"]}
                  onBlur={() => handleInputBlur("confirm-password")}
                  error={isNotValid["confirm-password"]}
                />
              </>
            )}
            <Button
              type="submit"
              classNames="bg-red-600 p-3 mt-3 text-white rounded-md text-lg"
              disabled={
                !didEdit.username ||
                !didEdit.password ||
                !didEdit.email ||
                !didEdit["confirm-password"] ||
                isNotValid.email.value ||
                isNotValid.password.value ||
                isNotValid.username.value ||
                isNotValid["confirm-password"].value
              }
            >
              Save Changes
            </Button>
          </form>
        </FormContainer>
      )}
    </>
  );
}
