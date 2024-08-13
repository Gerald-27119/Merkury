import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [mainError, setMainError] = useState("");

  const inputStyle = "w-full rounded-md p-2";
  const errorStyle = "text-red-600 text-xs p-0 m-0";

  useEffect(() => {
    if (username) setUsernameError("");
    setMainError("");
  }, [username]);

  const validateUsername = () => {
    if (username === "") {
      setUsernameError("Please enter your username");
      return false;
    } else if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
      setUsernameError("Please enter a valid username");
      return false;
    }
    return true;
  };

  const remindUser = (userData) => {
    return axios.post("http://localhost:8080/account/toBeAdded", userData);
  };

  const remindMutation = useMutation({
    mutationFn: remindUser,
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
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username === "") {
      setUsernameError("Please enter your username");
    }

    const isUsernameValid = validateUsername();
    if (!isUsernameValid) return;

    remindMutation.mutate({ username });
  };

  return (
    <div className="h-screen items-center justify-center flex bg-black">
      <div className="wrapper bg-amber-100 rounded-xl p-4 flex flex-col">
        <h1 className="text-center text-2xl font-bold mr-7 ml-7 mb-5">
          Forgot your password?
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onBlur={validateUsername}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className={inputStyle}
            maxLength={100}
          />{" "}
          <br />
          {usernameError && (
            <label className={errorStyle}>{usernameError}</label>
          )}
          <button
            type="submit"
            className="bg-black text-white rounded-lg w-full p-1 m-1 mt-2 mb-2"
          >
            Remind me
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
