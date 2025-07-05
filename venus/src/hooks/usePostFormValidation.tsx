import { isEmpty } from "../utils/validation/validation-rules";
import { useState } from "react";

type PostFormFields = {
  title: string;
  category: string;
  tags: string[];
};

type FieldValidationResult = { value: boolean; message: string };

const validateField = (
  field: keyof PostFormFields,
  value: any,
): FieldValidationResult => {
  switch (field) {
    case "title":
      if (isEmpty(value))
        return { value: false, message: "Title can't be empty." };
      if (value.length < 3)
        return {
          value: false,
          message: "Title must be at least 3 characters long.",
        };
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

const usePostFormValidation = (initialValues: PostFormFields) => {
  const [enteredValue, setEnteredValue] =
    useState<PostFormFields>(initialValues);
  const [didEdit, setDidEdit] = useState(
    Object.fromEntries(
      Object.keys(initialValues).map((k) => [k, false]),
    ) as Record<keyof PostFormFields, boolean>,
  );
  const [isValid, setIsValid] = useState(
    Object.fromEntries(
      Object.keys(initialValues).map((k) => [k, { value: true, message: "" }]),
    ) as Record<keyof PostFormFields, FieldValidationResult>,
  );

  const updateValues = (newValues: Partial<PostFormFields>) => {
    setEnteredValue((prev) => ({ ...prev, ...newValues }));
  };

  const handleInputChange = (field: keyof PostFormFields, value: any) => {
    setEnteredValue((prev) => ({ ...prev, [field]: value }));
    setDidEdit((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputBlur = (field: keyof PostFormFields) => {
    setDidEdit((prev) => ({ ...prev, [field]: true }));
    setIsValid((prev) => ({
      ...prev,
      [field]: validateField(field, enteredValue[field]),
    }));
  };

  const validate = () => {
    const newIsValid: Record<keyof PostFormFields, FieldValidationResult> = {
      title: validateField("title", enteredValue.title),
      category: validateField("category", enteredValue.category),
      tags: validateField("tags", enteredValue.tags),
    };

    setIsValid(newIsValid);
    return Object.values(newIsValid).every((field) => field.value);
  };

  return {
    enteredValue,
    didEdit,
    isValid,
    handleInputChange,
    handleInputBlur,
    updateValues,
    validate,
  };
};

export default usePostFormValidation;
