import axios from "axios";

export async function addComment({ text, spotId }) {
  await axios.post(
    `http://localhost:8080/spot/${spotId}/comment/add`,
    { text },
    {
      withCredentials: true,
    },
  );
  //return response.data; // Return the updated spot data
}

export async function updateComment({ commentId, text }) {
  await axios.post(
    `http://localhost:8080/spot/comment/edit/${commentId}`,
    { text },
    {
      withCredentials: true,
    },
  );
  //return response.data; // Return the updated comment
}

export async function deleteComment({ commentId }) {
  await axios.post(
    `http://localhost:8080/spot/comment/delete/${commentId}`,
    {},
    {
      withCredentials: true,
    },
  );
  //return response.data; // Return updated comments list
}
