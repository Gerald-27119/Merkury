import axios from "axios";
import PostDto from "../model/interface/forum/post/postDto";
import PostDetails from "../model/interface/forum/post/postDetails";
import PostCategoryAndTagsDto from "../model/interface/forum/postCategoryAndTagsDto";
import ForumPostPage from "../model/interface/forum/forumPostPage";
import { PostSortOption } from "../model/enum/forum/postSortOption";
import ForumReportDto from "../model/interface/forum/forumReportDto";
import TrendingPostDto from "../model/interface/forum/trendingPostDto";
import PostCategoryDto from "../model/interface/forum/postCategoryDto";
import TagDto from "../model/interface/tagDto";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function fetchPaginatedPosts(
    page: number,
    size: number,
    sortType: PostSortOption,
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

export async function fetchSearchedPosts(
    page: number,
    size: number,
    searchPhrase: string,
    category: string,
    tags: string[],
    fromDate: string,
    toDate: string,
    author: string,
    sortType: PostSortOption,
): Promise<ForumPostPage> {
    const { sortBy, sortDirection } = sortType;
    return (
        await axios.get(`${BASE_URL}/public/post/search`, {
            params: {
                page,
                size,
                sortBy,
                sortDirection,
                searchPhrase,
                category,
                tags: tags.join(","),
                fromDate,
                toDate,
                author,
            },
            withCredentials: true,
        })
    ).data;
}

export async function searchPosts(searchPhrase: string): Promise<string[]> {
    return (
        await axios.get(
            `${BASE_URL}/public/post/search/hints/${encodeURIComponent(searchPhrase)}`,
        )
    ).data;
}

export async function fetchTrendingPosts(): Promise<TrendingPostDto[]> {
    return (await axios.get(`${BASE_URL}/public/post/trending`)).data;
}

export async function fetchCategoriesAndTags(): Promise<PostCategoryAndTagsDto> {
    return (await axios.get(`${BASE_URL}/public/post/categories-tags`)).data;
}

export async function fetchAllCategoriesAlphabetically(): Promise<
    PostCategoryDto[]
> {
    return (await axios.get(`${BASE_URL}/public/post/categories`)).data;
}

export async function fetchAllTagsAlphabetically(): Promise<TagDto[]> {
    return (await axios.get(`${BASE_URL}/public/post/tags`)).data;
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

export async function reportPost({
    postId,
    report,
}: {
    postId: number;
    report: ForumReportDto;
}) {
    return await axios.patch(`${BASE_URL}/post/${postId}/report`, report, {
        withCredentials: true,
    });
}
