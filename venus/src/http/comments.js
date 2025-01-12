import axios from "axios";
import BASE_URL from "./baseUrl.js";

export async function addComment({ text, spotId }) {
  await axios.post(
    `${BASE_URL}/spot/comment`,
    { text, spotId },
    {
      withCredentials: true,
    },
  );
}
