import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function newPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mainError, setMainError] = useState("");

  const inputStyle = "w-full rounded-md p-2";
  const errorStyle = "text-red-600 text-xs p-0 m-0";
  const navigate = useNavigate();

  useEffect(() => {
    if (password) setPasswordError("");
    setMainError("");
  }, [password]);

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
        setMainError("Incorrect credentials");
      }

      console.log("Failed!");
    },
    onSuccess: (response) => {
      console.log(response.status);
      console.log("Success!");
      // navigate("/");
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    changeMutation.mutate({ username, password });
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
              type="password"
              placeholder="New Password"
              className={inputStyle}
              maxLength={100}
            />
          </div>
          <br />
          <div className="input-box text-sm font-medium text-gray-900 dark:text-black">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm New Password"
              className={inputStyle}
              maxLength={100}
            />
          </div>
          <br />
          <button
            type="submit"
            className="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default newPassword;
