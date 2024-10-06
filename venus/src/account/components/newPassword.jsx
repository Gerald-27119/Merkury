import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isEmail, isPassword, isEqualsToOtherValue } from "../regex.js";
import Input from "./Input.jsx";

function newPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mainError, setMainError] = useState("");

  const inputStyle = "w-full rounded-md p-2";
  const errorStyle = "text-red-600 text-xs p-0 m-0";
  const navigate = useNavigate();

  useEffect(() => {
    if (password) {
      setPasswordError("");
    }
    setMainError("");
  }, [password, confirmPassword]);

  const validatePassword = () => {
    if (password === "") {
      setPasswordError("Please enter your password");
      return false;
    } else if (!isPassword(password)) {
      setPasswordError(
        "Password must be minimum 8 long, contains small letter, big letter, number and special char",
      );
      return false;
    }
    return true;
  };

  const validateConfirmPassword = () => {
    if (confirmPassword === "") {
      setMainError("Field can't be empty");
      return false;
    } else if (!isEqualsToOtherValue(confirmPassword, password)) {
      setMainError("Password must be the same");
      return false;
    }
    return true;
  };

  const changePassword = (userData) => {
    return axios.post(
      "http://localhost:8080/account/set-new-password",
      userData,
    );
  };

  const changeMutation = useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      console.log(error.response.status);
      console.log(error.response.data);

      if (error.response.status === 401) {
        setMainError("Unauthorized or invalid token. Please try again.");
      }

      console.log("Failed!");
    },
    onSuccess: (response) => {
      console.log(response.status);
      console.log("Success! Password has been changed!");
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (isPasswordValid && isConfirmPasswordValid) {
      changeMutation.mutate({ token, password });
    }
  };

  return (
    <div className="h-screen items-center justify-center flex bg-black">
      <div className="wrapper bg-amber-100 rounded-xl p-4 flex flex-col">
        <h1 className="text-center text-2xl font-bold mr-7 ml-7 mb-5">
          Set new Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="input-box text-sm font-medium text-gray-900 dark:text-black">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              type="password"
              placeholder="New Password"
              className={inputStyle}
              maxLength={100}
            />
          </div>
          {passwordError && (
            <label className={errorStyle}>{passwordError}</label>
          )}
          <br />
          <div className="input-box text-sm font-medium text-gray-900 dark:text-black">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validateConfirmPassword}
              type="password"
              placeholder="Confirm New Password"
              className={inputStyle}
              maxLength={100}
            />
          </div>
          {mainError && <label className={errorStyle}>{mainError}</label>}
          <br />
          <button
            type="submit"
            className="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
            disabled={changeMutation.isLoading}
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default newPassword;
