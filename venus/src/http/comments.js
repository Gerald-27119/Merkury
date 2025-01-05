import axios from "axios";

export async function addComment({ text, spotId }) {
  try {
    return await axios.post(
      `http://localhost:8080/spot/comment/add`,
      { text, spotId },
      {
        withCredentials: true,
      },
    );
  } catch (error) {
    console.error("Error adding comment:", error.response || error.message);
  }
}

export async function updateComment({ commentId, text }) {
  try {
    return await axios.post(
      `http://localhost:8080/spot/comment/edit`,
      { text, commentId },
      {
        withCredentials: true,
      },
    );
  } catch (error) {
    console.error("Error adding comment:", error.response || error.message);
  }
}

export async function deleteComment({ commentId }) {
  try {
    return await axios.post(
      `http://localhost:8080/spot/comment/delete/${commentId}`,
      {},
      {
        withCredentials: true,
      },
    );
  } catch (error) {
    console.error("Error adding comment:", error.response || error.message);
  }
}
