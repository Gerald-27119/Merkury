import axios from "axios";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getPaginatedComments(spotId, page, commentsPerPage) {
  return (
    await axios.get(
      `${BASE_URL}/public/spot/comments?spotId=${spotId}&page=${page}&size=${commentsPerPage}`,
    )
  ).data;
}
