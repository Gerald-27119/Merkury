import axios from "axios";

export default async function handleOauth2Login(errorMessage, url) {
  try {
    const response = await axios.get(url);
    window.location.href = response.data.redirectUrl;
  } catch (error) {
    console.error(errorMessage, error);
  }
}
