import { useState } from "react";
import {
    isEmail,
    isEqualsToOtherValue,
    isEmpty,
    isPassword,
    isUsername,
} from "../utils/validation/validation-rules.js";

const useUserDataValidation = (
    initialValues,
    shouldPasswordMatchRegex = true,
) => {
    const [enteredValue, setEnteredValue] = useState(initialValues);
    const [validatePasswordRegex, setValidatePasswordRegex] = useState(
        shouldPasswordMatchRegex,
    );
    function updateShouldPasswordMatchRegex(newValue) {
        setValidatePasswordRegex((prevState) => ({
            ...prevState,
            ...newValue,
        }));
    }
    function updateValues(newValues) {
        setEnteredValue((prevValues) => ({ ...prevValues, ...newValues }));
    }
    const [didEdit, setDidEdit] = useState(
        Object.fromEntries(
            Object.keys(initialValues).map((key) => [key, false]),
        ),
    );
    const [isValid, setIsValid] = useState(
        Object.fromEntries(
            Object.keys(initialValues).map((key) => [
                key,
                { value: true, message: "" },
            ]),
        ),
    );

    const validateField = (field, value) => {
        let error = { isValid: true, message: "" };

        if (field === "username") {
            if (isEmpty(value)) {
                error = { isValid: false, message: "Username can't be empty." };
            } else if (!isUsername(value)) {
                error = {
                    isValid: false,
                    message: "Username must contain 3 to 16 characters.",
                };
            }
        } else if (field === "email") {
            if (isEmpty(value)) {
                error = { isValid: false, message: "E-mail can't be empty." };
            } else if (!isEmail(value)) {
                error = { isValid: false, message: "E-mail must contain @." };
            }
        } else if (field === "old-password") {
            if (isEmpty(value)) {
                error = {
                    isValid: false,
                    message: "Old password can't be empty.",
                };
            }
        } else if (field === "password") {
            if (isEmpty(value)) {
                error = { isValid: false, message: "Password can't be empty." };
            } else if (validatePasswordRegex && !isPassword(value)) {
                error = {
                    isValid: false,
                    message:
                        "Password must be at least 8 characters long and contain a lowercase letter, uppercase letter, number, and special character.",
                };
            } else if (
                isEqualsToOtherValue(value, enteredValue["old-password"])
            ) {
                error = {
                    isValid: false,
                    message: "New password must be different.",
                };
            }
        } else if (field === "confirm-password") {
            if (isEmpty(value)) {
                error = { isValid: false, message: "Password can't be empty." };
            } else if (!isEqualsToOtherValue(value, enteredValue.password)) {
                error = {
                    isValid: false,
                    message: "Passwords must be the same.",
                };
            }
        }
        return { value: error.isValid, message: error.message };
    };

    const validate = () => {
        const newIsValid = {};
        Object.keys(enteredValue).forEach((field) => {
            newIsValid[field] = validateField(field, enteredValue[field]);
        });
        setIsValid(newIsValid);

        return Object.values(newIsValid).every((field) => !field.value);
    };

    const handleInputChange = (field, event) => {
        const { value } = event.target;
        setEnteredValue((prev) => ({ ...prev, [field]: value }));
        setDidEdit((prev) => ({ ...prev, [field]: true }));
    };

    const handleInputBlur = (field) => {
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
