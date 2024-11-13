import axios from "axios";

export async function registerUser(user) {
  const url = "http://localhost:8080/account/register";
  return await axios.post(url, user);
}

export async function loginUser(userData) {
  return await axios.post("http://localhost:8080/account/login", userData, {
    withCredentials: true,
  });
}
