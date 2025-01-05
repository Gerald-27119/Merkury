import FormContainer from "../../components/FormContainer.jsx";
import Input from "../../components/Input.jsx";
import Button from "./Button.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editUserData, getUser } from "../../http/account.js";
import useValidation from "../../hooks/useValidation.jsx";
import { useEffect, useState } from "react";

export default function EditUserData() {
  const [isPasswordChange, setIsPasswordChange] = useState(false);

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
    isNotValid,
    handleInputChange,
    handleInputBlur,
    updateValues,
    updateShouldValidatePassword,
  } = useValidation(
    {
      password: "",
      username: "",
      email: "",
      "confirm-password": "",
    },
    isPasswordChangeable && isPasswordChange,
  );

  useEffect(() => {
    updateShouldValidatePassword(isPasswordChange);
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
        isPasswordChanged: isPasswordChangeable && isPasswordChange,
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
                {isPasswordChange && (
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
                  classNames="bg-blue-500 p-3 mt-3 text-white rounded-md text-lg hover:bg-blue-600"
                  type="button"
                  onClick={() => {
                    setIsPasswordChange((prevState) => !prevState);
                  }}
                >
                  {!isPasswordChange
                    ? "Change Password"
                    : "Don't change Password"}
                </Button>
              </>
            )}
            <Button
              type="submit"
              classNames="bg-red-600 p-3 mt-3 text-white rounded-md text-lg hover:bg-red-700"
              // disabled={
              //   !didEdit.username ||
              //   !didEdit.password ||
              //   !didEdit.email ||
              //   !didEdit["confirm-password"] ||
              //   isNotValid.email.value ||
              //   isNotValid.password.value ||
              //   isNotValid.username.value ||
              //   isNotValid["confirm-password"].value
              // }
            >
              Save Changes
            </Button>
          </form>
        </FormContainer>
      )}
    </>
  );
}
