import { useState } from "react";
import {
  isEmail,
  isEqualsToOtherValue,
  isEmpty,
  isPassword,
  isUsername,
} from "../utils/validation/validation-rules";

type CombinedFormFields = {
  username?: string;
  email?: string;
  "old-password"?: string;
  password?: string;
  "confirm-password"?: string;
  title?: string;
  category?: string;
  tags?: string[];
};

type FieldValidationResult = {
  value: boolean;
  message: string;
};

const useUserDataValidation = (
  initialValues: CombinedFormFields,
  shouldPasswordMatchRegex: boolean = true,
) => {
  const [enteredValue, setEnteredValue] =
    useState<CombinedFormFields>(initialValues);
  const [validatePasswordRegex, setValidatePasswordRegex] = useState<boolean>(
    shouldPasswordMatchRegex,
  );

  const updateShouldPasswordMatchRegex = (newValue: boolean) => {
    setValidatePasswordRegex(newValue);
  };

  const updateValues = (newValues: Partial<CombinedFormFields>) => {
    setEnteredValue((prev) => ({ ...prev, ...newValues }));
  };

  const [didEdit, setDidEdit] = useState<
    Record<keyof CombinedFormFields, boolean>
  >(
    Object.fromEntries(
      Object.keys(initialValues).map((key) => [key, false]),
    ) as Record<keyof CombinedFormFields, boolean>,
  );

  const [isValid, setIsValid] = useState<
    Record<keyof CombinedFormFields, FieldValidationResult>
  >(
    Object.fromEntries(
      Object.keys(initialValues).map((key) => [
        key,
        { value: true, message: "" },
      ]),
    ) as Record<keyof CombinedFormFields, FieldValidationResult>,
  );

  const validateField = (
    field: keyof CombinedFormFields,
    value: any,
  ): FieldValidationResult => {
    switch (field) {
      case "username":
        if (isEmpty(value)) {
          return { value: false, message: "Username can't be empty." };
        }
        if (!isUsername(value)) {
          return {
            value: false,
            message: "Username must contain 3 to 16 characters.",
          };
        }
        return { value: true, message: "" };

      case "email":
        if (isEmpty(value)) {
          return { value: false, message: "E-mail can't be empty." };
        }
        if (!isEmail(value)) {
          return { value: false, message: "E-mail must contain @." };
        }
        return { value: true, message: "" };

      case "old-password":
        if (isEmpty(value)) {
          return { value: false, message: "Old password can't be empty." };
        }
        return { value: true, message: "" };

      case "password":
        if (isEmpty(value)) {
          return { value: false, message: "Password can't be empty." };
        }
        if (validatePasswordRegex && !isPassword(value)) {
          return {
            value: false,
            message:
              "Password must be at least 8 characters long and contain a lowercase letter, uppercase letter, number, and special character.",
          };
        }
        if (isEqualsToOtherValue(value, enteredValue["old-password"])) {
          return { value: false, message: "New password must be different." };
        }
        return { value: true, message: "" };

      case "confirm-password":
        if (isEmpty(value)) {
          return { value: false, message: "Password can't be empty." };
        }
        if (!isEqualsToOtherValue(value, enteredValue.password)) {
          return { value: false, message: "Passwords must be the same." };
        }
        return { value: true, message: "" };

      case "title":
        if (isEmpty(value)) {
          return { value: false, message: "Title can't be empty." };
        }
        if (value.length < 3) {
          return {
            value: false,
            message: "Title must be at least 3 characters long.",
          };
        }
        return { value: true, message: "" };

      case "category":
        if (isEmpty(value)) {
          return { value: false, message: "Please select a valid category." };
        }
        return { value: true, message: "" };

      case "tags":
        if (!Array.isArray(value)) {
          return { value: false, message: "Tags: Invalid data format." };
        }
        if (value.length > 3) {
          return { value: false, message: "Max 3 tags are allowed" };
        }
        return { value: true, message: "" };

      default:
        return { value: true, message: "" };
    }
  };

  const validate = () => {
    const newIsValid: Record<keyof CombinedFormFields, FieldValidationResult> =
      {} as any;

    (Object.keys(enteredValue) as (keyof CombinedFormFields)[]).forEach(
      (field) => {
        newIsValid[field] = validateField(field, enteredValue[field]);
      },
    );

    setIsValid(newIsValid);

    return Object.values(newIsValid).every((field) => field.value);
  };

  const handleInputChange = (
    field: keyof CombinedFormFields,
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { value } = event.target;
    setEnteredValue((prev) => ({ ...prev, [field]: value }));
    setDidEdit((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputBlur = (field: keyof CombinedFormFields) => {
    setDidEdit((prev) => ({ ...prev, [field]: true }));
    setIsValid((prev) => ({
      ...prev,
      [field]: validateField(field, enteredValue[field]),
    }));
  };

  return {
    enteredValue,
    didEdit,
    isValid,
    handleInputChange,
    handleInputBlur,
    validate,
    updateValues,
    updateShouldPasswordMatchRegex,
  };
};

export default useUserDataValidation;
