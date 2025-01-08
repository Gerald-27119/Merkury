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

export async function updateComment({ commentId, text }) {
  await axios.post(
    `http://localhost:8080/spot/comment/edit`,
    { text, commentId },
    {
      withCredentials: true,
    },
  );
}

export async function deleteComment({ commentId }) {
  await axios.post(
    `http://localhost:8080/spot/comment/delete/${commentId}`,
    {},
    {
      withCredentials: true,
    },
  );
}
