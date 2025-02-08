import axios from "axios";
import BASE_URL from "./base-url.js";

export async function getPaginatedComments(spotId, page, commentsPerPage) {
  return (
    await axios.get(
      `${BASE_URL}/public/spot/comments?spotId=${spotId}&page=${page}&size=${commentsPerPage}`,
    )
  ).data;
}
