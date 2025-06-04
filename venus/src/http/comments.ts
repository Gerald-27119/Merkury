import axios from "axios";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getPaginatedComments(spotId: number, page: number) {
  return (
    await axios.get(`${BASE_URL}/public/spot/${spotId}/comments`, {
      params: { page },
      withCredentials: true,
    })
  ).data;
}

//TODO:other task
export async function addComment({ spotId, newComment }) {
  return await axios.post(`${BASE_URL}/spot/${spotId}/comments`, newComment, {
    withCredentials: true,
  });
}

//TODO: other task
export async function deleteComment(commentId) {
  return await axios.delete(`${BASE_URL}/spot/comments/${commentId}`, {
    withCredentials: true,
  });
}

//TODO: other task
export async function editComment({ commentId, editedComment }) {
  return await axios.patch(
    `${BASE_URL}/spot/comments/${commentId}`,
    editedComment,
    { withCredentials: true },
  );
}

type voteCommentProps = {
  commentId: number;
  isUpvote: boolean;
};

export async function voteComment({ commentId, isUpvote }: voteCommentProps) {
  return await axios.patch(
    `${BASE_URL}/spot/comments/${commentId}/vote`,
    null,
    {
      params: { isUpvote },
      withCredentials: true,
    },
  );
}
