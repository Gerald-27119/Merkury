import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { isEmail } from "../../validation/validator.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mainError, setMainError] = useState("");

  const inputStyle = "w-full rounded-md p-2";
  const errorStyle = "text-red-600 text-xs p-0 m-0";

  useEffect(() => {
    if (email) {
      setEmailError("");
    }
    setMainError("");
  }, [email]);

  const validateEmail = () => {
    if (email === "") {
      setEmailError("Please enter your email");
      return false;
    } else if (!isEmail(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const remindUser = (email) => {
    return axios.post("http://localhost:8080/account/forgot-password", email, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  };

  const remindMutation = useMutation({
    mutationFn: remindUser,
    onError: (error) => {
      console.log(error.response.status);
      console.log(error.response.data);

      if (error.response.status === 404) {
        setMainError("User with such email doesn't exists!");
      }

      console.log("Failed!");
    },
    onSuccess: (response) => {
      console.log(response.status);
      console.log("Success!");
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isEmailValid = validateEmail();

    if (isEmailValid && !remindMutation.isLoading) {
      remindMutation.mutate(email);
    }
  };

  return (
    <div className="h-screen items-center justify-center flex bg-black">
      <div className="wrapper bg-amber-100 rounded-xl p-4 flex flex-col">
        <h1 className="text-center text-2xl font-bold mr-7 ml-7 mb-5">
          Forgot your password?
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="input-box text-sm font-medium text-gray-900 dark:text-black">
            <input
              value={email}
              onBlur={validateEmail}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className={inputStyle}
              maxLength={100}
            />
          </div>
          {emailError && <label className={errorStyle}>{emailError}</label>}
          {mainError && <label className={errorStyle}>{mainError}</label>}
          <br />
          <button
            type="submit"
            className="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
            disabled={remindMutation.isLoading}
          >
            Remind me
          </button>
        </form>
      </div>
    </div>
  );
}
