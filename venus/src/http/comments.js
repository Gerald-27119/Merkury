import axios from "axios";

export async function addComment({ text, spotId }) {
  await axios.post(
    `http://localhost:8080/spot/comment/add`,
    { text, spotId },
    {
      withCredentials: true,
    },
  );
}
