import axios from "axios";
import { json } from "react-router-dom";

export default async function handleOauth2Login(errorMessage, url) {
  const response = await axios.get(url);
  if (response.status !== 201) {
    throw json({ message: response.message }, { status: response.status });
  }
  window.location.href = "/temp";
}
