import FormContainer from "../../components/form/FormContainer.jsx";
import Input from "../../components/form/Input.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editUserData, getUser } from "../../http/account.js";
import useUserDataValidation from "../../hooks/useUserDataValidation.jsx";
import { useEffect, useState } from "react";
import ProviderInfo from "./components/ProviderInfo.jsx";
import Error from "../../components/error/Error.jsx";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner.jsx";

export default function EditUserData() {
  const [isPasswordChange, setIsPasswordChange] = useState(false);

  const {
    mutate,
    isSuccess: isMutationSuccess,
    error: mutationError,
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
  });

  let userData = {};
  if (queryData) {
    userData = queryData;
  }

  const { provider, id } = userData;
  const isPasswordChangeable = provider === "NONE";
  const {
    enteredValue,
    didEdit,
    isValid,
    handleInputChange,
    handleInputBlur,
    updateValues,
    updateShouldPasswordMatchRegex,
  } = useUserDataValidation(
    {
      password: "",
      username: "",
      email: "",
      "confirm-password": "",
      "old-password": "",
    },
    isPasswordChangeable && isPasswordChange,
  );

  useEffect(() => {
    updateShouldPasswordMatchRegex(isPasswordChange);
  }, [isPasswordChange]);

  useEffect(() => {
    if (isQuerySuccess && queryData) {
      updateValues({
        username: queryData.username || "",
        email: queryData.email || "",
        password: "",
        "confirm-password": "",
      });
    }
  }, [isQuerySuccess, queryData]);

  function handleSubmit(event) {
    event.preventDefault();
    mutate({
      id,
      user: {
        username: enteredValue.username,
        email: enteredValue.email,
        provider,
        password: enteredValue.password,
        oldPassword: enteredValue["old-password"],
        isPasswordChanged: isPasswordChangeable && isPasswordChange,
      },
    });
  }

  if (queryError || mutationError) {
    const error = queryError || mutationError;
    return <Error error={error} />;
  }

  const handleClickChangePassword = () => {
    setIsPasswordChange((prevState) => !prevState);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {isQuerySuccess && (
        <FormContainer
          notificationMessage="Data edited successfully!"
          isSuccess={
            isMutationSuccess !== undefined ? isMutationSuccess : isQuerySuccess
          }
          error={mutationError !== undefined ? mutationError : queryError}
          navigateTo="/login"
          linkCaption="Already have an account?"
          header="Edit Your Data"
          navigateOnSuccess="/edit-data"
        >
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              id="username"
              onChange={(event) => handleInputChange("username", event)}
              value={enteredValue.username}
              onBlur={() => handleInputBlur("username")}
              isValid={isValid.username}
            />
            {provider === "NONE" && (
              <Input
                label="E-mail"
                type="email"
                id="email"
                onChange={(event) => handleInputChange("email", event)}
                value={enteredValue.email}
                onBlur={() => handleInputBlur("email")}
                isValid={isValid.email}
              />
            )}
            {isPasswordChangeable && (
              <>
                {isPasswordChange && (
                  <>
                    <Input
                      label="Old Password"
                      type="password"
                      id="old-password"
                      onChange={(event) =>
                        handleInputChange("old-password", event)
                      }
                      value={enteredValue["old-password"]}
                      onBlur={() => handleInputBlur("old-password")}
                      isValid={isValid["old-password"]}
                    />
                    <Input
                      label="Password"
                      type="password"
                      id="password"
                      onChange={(event) => handleInputChange("password", event)}
                      value={enteredValue.password}
                      onBlur={() => handleInputBlur("password")}
                      isValid={isValid.password}
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
                      isValid={isValid["confirm-password"]}
                    />
                  </>
                )}
                <button
                  className="mt-3 rounded-md bg-blue-500 p-3 text-lg text-white hover:bg-blue-600"
                  type="button"
                  onClick={() => handleClickChangePassword()}
                >
                  {!isPasswordChange
                    ? "Change Password"
                    : "Don't change Password"}
                </button>
              </>
            )}
            {provider !== "NONE" && (
              <ProviderInfo provider={provider} email={userData.email} />
            )}
            <button
              type="submit"
              className="mt-3 rounded-md bg-red-600 p-3 text-lg text-white hover:bg-red-700"
              disabled={
                (didEdit.username && !isValid.username.value) ||
                (didEdit["old-password"] && !isValid["old-password"].value) ||
                (didEdit.password && !isValid.password.value) ||
                (didEdit.email && !isValid.email.value) ||
                (didEdit["confirm-password"] &&
                  !isValid["confirm-password"].value)
              }
            >
              Save Changes
            </button>
          </form>
        </FormContainer>
      )}
    </>
  );
}
