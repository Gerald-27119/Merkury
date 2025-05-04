import axios from "axios";
import PostDto from "../model/interface/forum/post/PostDto";
import PaginatedPosts from "../model/interface/forum/post/PaginatedPosts";
import PostDetails from "../model/interface/forum/post/PostDetails";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function fetchPaginatedPosts(
  page: number,
): Promise<PaginatedPosts> {
  return (
    await axios.get(`${BASE_URL}/public/post`, {
      params: { page },
      withCredentials: true,
    })
  ).data;
}

export async function fetchDetailedPost(postId: number): Promise<PostDetails> {
  return (
    await axios.get(`${BASE_URL}/public/post/${postId}`, {
      withCredentials: true,
    })
  ).data;
}

export async function fetchCategoriesAndTags() {
  return (await axios.get(`${BASE_URL}/categories-tags`)).data;
}

export async function addPost(newPost: PostDto) {
  return await axios.post(`${BASE_URL}/post`, newPost, {
    withCredentials: true,
  });
}

export async function editPost(postId: number, PostData: PostDto) {
  return await axios.patch(`${BASE_URL}/post/${postId}`, PostData, {
    withCredentials: true,
  });
}

export async function deletePost(postId: number) {
  return await axios.delete(`${BASE_URL}/post/${postId}`, {
    withCredentials: true,
  });
}

export async function votePost(postId: number, isUpvote: boolean) {
  return await axios.patch(`${BASE_URL}/post/${postId}/vote`, null, {
    params: { isUpvote },
    withCredentials: true,
  });
}
