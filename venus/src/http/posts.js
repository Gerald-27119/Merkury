import axios from "axios";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function fetchPaginatedPosts(page) {
  return (
    await axios.get(`${BASE_URL}/public/post`, {
      params: { page },
      withCredentials: true,
    })
  ).data;
}

export async function fetchDetailedPost(postId) {
  return (
    await axios.get(`${BASE_URL}/public/post/${postId}`, {
      withCredentials: true,
    })
  ).data;
}

export async function fetchCategoriesAndTags() {
  return (await axios.get(`${BASE_URL}/categories-tags`)).data;
}

export async function addPost(newPost) {
  return await axios.post(`${BASE_URL}/post`, newPost, {
    withCredentials: true,
  });
}

export async function editPost(postId, PostData) {
  return await axios.patch(`${BASE_URL}/post/${postId}`, PostData, {
    withCredentials: true,
  });
}

export async function deletePost(postId) {
  return await axios.delete(`${BASE_URL}/post/${postId}`, {
    withCredentials: true,
  });
}

export async function votePost(postId, isUpvote) {
  return await axios.patch(`${BASE_URL}/post/${postId}/vote`, null, {
    params: { isUpvote },
    withCredentials: true,
  });
}
