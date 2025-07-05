import { useState } from "react";

type ValidationResult = { value: boolean; message: string };

type ValidationRule<T> = (value: any, allValues: T) => ValidationResult;

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule<T>>>,
) => {
  const [enteredValue, setEnteredValue] = useState<T>(initialValues);
  const [didEdit, setDidEdit] = useState<Record<keyof T, boolean>>(
    Object.fromEntries(
      Object.keys(initialValues).map((key) => [key, false]),
    ) as Record<keyof T, boolean>,
  );

  const [isValid, setIsValid] = useState<Record<keyof T, ValidationResult>>(
    Object.fromEntries(
      Object.keys(initialValues).map((key) => [
        key,
        { value: true, message: "" },
      ]),
    ) as Record<keyof T, ValidationResult>,
  );

  const validateField = (field: keyof T, value: any): ValidationResult => {
    const validator = validationRules[field];
    if (!validator) return { value: true, message: "" };
    return validator(value, enteredValue);
  };

  const handleInputChange = (field: keyof T, value: any) => {
    setEnteredValue((prev) => ({ ...prev, [field]: value }));
    setDidEdit((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputBlur = (field: keyof T) => {
    setDidEdit((prev) => ({ ...prev, [field]: true }));
    setIsValid((prev) => ({
      ...prev,
      [field]: validateField(field, enteredValue[field]),
    }));
  };

  const validate = () => {
    const newIsValid = {} as Record<keyof T, ValidationResult>;
    for (const key in initialValues) {
      newIsValid[key] = validateField(key, enteredValue[key]);
    }
    setIsValid(newIsValid);
    return Object.values(newIsValid).every((field) => field.value);
  };

  const updateValues = (newValues: Partial<T>) => {
    setEnteredValue((prev) => ({ ...prev, ...newValues }));
  };

  return {
    enteredValue,
    didEdit,
    isValid,
    handleInputChange,
    handleInputBlur,
    validate,
    updateValues,
  };
};
