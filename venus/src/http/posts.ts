import axios from "axios";
import PostDto from "../model/interface/forum/post/postDto";
import PostDetails from "../model/interface/forum/post/postDetails";
import ForumCategoryAndTagsDto from "../model/interface/forum/forumCategoryAndTagsDto";
import ForumPostPage from "../model/interface/forum/forumPostPage";
import { ForumPostSortOption } from "../model/enum/forum/forumPostSortOption";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function fetchPaginatedPosts(
    page: number,
    size: number,
    sortType: ForumPostSortOption,
): Promise<ForumPostPage> {
    const { sortBy, sortDirection } = sortType;
    return (
        await axios.get(`${BASE_URL}/public/post`, {
            params: { page, size, sortBy, sortDirection },
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

export async function fetchCategoriesAndTags(): Promise<ForumCategoryAndTagsDto> {
    return (await axios.get(`${BASE_URL}/public/categories-tags`)).data;
}

export async function addPost(newPost: PostDto) {
    return await axios.post(`${BASE_URL}/post`, newPost, {
        withCredentials: true,
    });
}

export async function editPost({
    postId,
    postData,
}: {
    postId: number;
    postData: PostDto;
}) {
    return await axios.patch(`${BASE_URL}/post/${postId}`, postData, {
        withCredentials: true,
    });
}

export async function deletePost(postId: number): Promise<void> {
    return await axios.delete(`${BASE_URL}/post/${postId}`, {
        withCredentials: true,
    });
}

export async function votePost({
    id,
    isUpvote,
}: {
    id: number;
    isUpvote: boolean;
}) {
    return await axios.patch(`${BASE_URL}/post/${id}/vote`, null, {
        params: { isUpvote },
        withCredentials: true,
    });
}

export async function followPost(postId: number) {
    return await axios.patch(`${BASE_URL}/post/${postId}/follow`, null, {
        withCredentials: true,
    });
}

export async function reportPost(postId: number) {
    return await axios.patch(`${BASE_URL}/post/${postId}/report`, null, {
        withCredentials: true,
    });
}
