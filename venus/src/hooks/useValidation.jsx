import { useState } from "react";
import {
  isEmail,
  isEqualsToOtherValue,
  isNotEmpty,
  isPassword,
  isUsername,
} from "../validation/validation-rules.js";

const useValidation = (initialValues, shouldValidatePassword = true) => {
  const [enteredValue, setEnteredValue] = useState(initialValues);
  const [validatePassword, setValidatePassword] = useState(
    shouldValidatePassword,
  );
  function updateShouldValidatePassword(newValue) {
    setValidatePassword((prevState) => ({ ...prevState, ...newValue }));
  }
  function updateValues(newValues) {
    setEnteredValue((prevValues) => ({ ...prevValues, ...newValues }));
  }
  const [didEdit, setDidEdit] = useState(
    Object.fromEntries(Object.keys(initialValues).map((key) => [key, false])),
  );
  const [isNotValid, setIsNotValid] = useState(
    Object.fromEntries(
      Object.keys(initialValues).map((key) => [
        key,
        { value: false, message: "" },
      ]),
    ),
  );

  const validateField = (field, value) => {
    let error = { value: false, message: "" };

    if (field === "username") {
      if (!isNotEmpty(value)) {
        error = { value: true, message: "Username can't be empty." };
      } else if (!isUsername(value)) {
        error = {
          value: true,
          message: "Username must contain 3 to 16 characters.",
        };
      }
    } else if (field === "email") {
      if (!isNotEmpty(value)) {
        error = { value: true, message: "E-mail can't be empty." };
      } else if (!isEmail(value)) {
        error = { value: true, message: "E-mail must contain @." };
      }
    } else if (field === "old-password") {
      if (!isNotEmpty(value)) {
        error = { value: true, message: "Old password can't be empty." };
      }
    } else if (field === "password") {
      if (!isNotEmpty(value)) {
        error = { value: true, message: "Password can't be empty." };
      } else if (validatePassword && !isPassword(value)) {
        error = {
          value: true,
          message:
            "Password must be at least 8 characters long and contain a lowercase letter, uppercase letter, number, and special character.",
        };
      } else if (isEqualsToOtherValue(value, enteredValue["old-password"])) {
        error = { value: true, message: "New password must be different." };
      }
    } else if (field === "confirm-password") {
      if (!isNotEmpty(value)) {
        error = { value: true, message: "Password can't be empty." };
      } else if (!isEqualsToOtherValue(value, enteredValue.password)) {
        error = { value: true, message: "Passwords must be the same." };
      }
    }

    return error;
  };

  const validate = () => {
    const newIsValid = {};
    Object.keys(enteredValue).forEach((field) => {
      newIsValid[field] = validateField(field, enteredValue[field]);
    });
    setIsNotValid(newIsValid);

    return Object.values(newIsValid).every((field) => !field.value);
  };

  const handleInputChange = (field, event) => {
    const { value } = event.target;
    setEnteredValue((prev) => ({ ...prev, [field]: value }));
    setDidEdit((prev) => ({ ...prev, [field]: true }));

    setIsNotValid((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const handleInputBlur = (field) => {
    setDidEdit((prev) => ({ ...prev, [field]: true }));
    setIsNotValid((prev) => ({
      ...prev,
      [field]: validateField(field, enteredValue[field]),
    }));
  };

  return {
    enteredValue,
    didEdit,
    isNotValid,
    handleInputChange,
    handleInputBlur,
    validate,
    updateValues,
    updateShouldValidatePassword,
  };
};

export default useValidation;
