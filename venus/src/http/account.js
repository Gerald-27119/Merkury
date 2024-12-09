import axios from "axios";

export async function registerUser(user) {
  const url = "http://localhost:8080/account/register";
  return await axios.post(url, user,{
    withCredentials: true,
  });
}

export async function loginUser(userData) {
  return await axios.post("http://localhost:8080/account/login", userData, {
    withCredentials: true,
  });
}

export async function sentEmailWithNewPasswordLink(email) {
  console.log("sending email...");
  return await axios.post(
    "http://localhost:8080/account/forgot-password",
    email,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
}

export async function changePassword(userData) {
  return await axios.post(
    "http://localhost:8080/account/set-new-password",
    userData,
  );
}

export async function logout() {
  await axios.post(
    "http://localhost:8080/account/oauth2/logout",
    {},
    {
      withCredentials: true,
    },
  );
}

export const googleLogoutUrl =
  "http://localhost:8080/oauth2/authorization/google";
export const githubLogoutUrl =
  "http://localhost:8080/oauth2/authorization/github";
