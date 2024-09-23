import axios from "axios";
import { json } from "react-router-dom";

export default async function handleOauth2Login(errorMessage, url) {
  // const response = await axios.get(url);
  // const data = await response.data;
  // if (response.status !== 201) {
  //   throw json({ message: response.message }, { status: response.status });
  // }

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.data; // Parse the response data
    console.log("response:");
    console.log(response.data);
    if (response.status === 200) {
      window.location.href = data.redirectUrl; // Redirect to the main view
    } else {
      console.error("No data received from the server");
    }
  } catch (error) {
    console.error(errorMessage, error);
  }
  // window.location.href = "/main-view";
}
