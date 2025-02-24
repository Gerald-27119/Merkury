import axios from "axios";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getPaginatedComments(spotId, page) {
  return (
    await axios.get(`${BASE_URL}/public/spot/${spotId}/comments`, {
      params: { page },
      withCredentials: true,
    })
  ).data;
}

export async function addComment(newComment) {
  return await axios.post(`${BASE_URL}/spot/comments`, newComment, {
    withCredentials: true,
  });
}

export async function deleteComment(commentId) {
  return await axios.delete(`${BASE_URL}/spot/comments/${commentId}`, {
    withCredentials: true,
  });
}

export async function editComment({ commentId, editedComment }) {
  return await axios.patch(
    `${BASE_URL}/spot/comments/${commentId}`,
    editedComment,
    { withCredentials: true },
  );
}

export async function upvoteComment(commentId) {
  return await axios.patch(
    `${BASE_URL}/spot/comments/${commentId}/upvote`,
    null,
    {
      withCredentials: true,
    },
  );
}
export async function downvoteComment(commentId) {
  return await axios.patch(
    `${BASE_URL}/spot/comments/${commentId}/downvote`,
    null,
    {
      withCredentials: true,
    },
  );
}
