import axios from "axios";
import BASE_URL from "./baseUrl.js";
export async function registerUser(user) {
  return await axios.post(`${BASE_URL}/public/account/register`, user, {
    withCredentials: true,
  });
}

export async function loginUser(userData) {
  return await axios.post(`${BASE_URL}/public/account/login`, userData, {
    withCredentials: true,
  });
}

export async function sentEmailWithNewPasswordLink(email) {
  console.log("sending email...");
  return await axios.post(`${BASE_URL}/public/account/forgot-password`, email, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export async function changePassword(userData) {
  return await axios.post(
    `${BASE_URL}/public/account/set-new-password`,
    userData,
  );
}

export async function logout() {
  await axios.post(
    `${BASE_URL}/account/oauth2/logout`,
    {},
    {
      withCredentials: true,
    },
  );
}

export async function test() {
  return (
    await axios.get(`${BASE_URL}/private/test`, {
      withCredentials: true,
    })
  ).data;
}

export async function getUser() {
  return (
    await axios.get(`${BASE_URL}/account/get-user`, {
      withCredentials: true,
    })
  ).data;
}

export async function editUserData({ id, user }) {
  return (
    await axios.patch(`${BASE_URL}/account/edit-data/${id}`, user, {
      withCredentials: true,
    })
  ).data;
}

export const googleLogoutUrl = `${BASE_URL}/oauth2/authorization/google`;
export const githubLogoutUrl = `${BASE_URL}/oauth2/authorization/github`;
