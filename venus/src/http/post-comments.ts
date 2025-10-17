import axios from "axios";
import { ForumCommentSortOption } from "../model/enum/forum/forumCommentSortOption";
import ForumCommentPage from "../model/interface/forum/postComment/forumCommentPage";
import ForumCommentDto from "../model/interface/forum/postComment/forumCommentDto";
import ForumCommentReplyPage from "../model/interface/forum/postComment/forumCommentReplyPage";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getCommentsByPostId(
    postId: number,
    page: number,
    size: number,
    sortType: ForumCommentSortOption,
): Promise<ForumCommentPage> {
    const { sortBy, sortDirection } = sortType;
    return (
        await axios.get(`${BASE_URL}/public/post/${postId}/comments`, {
            params: { page, size, sortBy, sortDirection },
            withCredentials: true,
        })
    ).data;
}

export async function getCommentRepliesByCommentId(
    commentId: number,
    size: number,
    lastDate?: string,
    lastId?: number,
): Promise<ForumCommentReplyPage> {
    const params: Record<string, any> = { size };
    if (lastDate) params.lastDate = lastDate;
    if (lastId) params.lastId = lastId;
    return (
        await axios.get(`${BASE_URL}/public/comments/${commentId}/replies`, {
            params: params,
            withCredentials: true,
        })
    ).data;
}

export async function addComment({
    postId,
    newComment,
}: {
    postId: number;
    newComment: ForumCommentDto;
}) {
    return await axios.post(`${BASE_URL}/post/${postId}/comments`, newComment, {
        withCredentials: true,
    });
}

export async function editComment(
    commentId: number,
    commentData: ForumCommentDto,
) {
    return await axios.patch(
        `${BASE_URL}/post/comments/${commentId}`,
        commentData,
        {
            withCredentials: true,
        },
    );
}

export async function deleteComment(commentId: number): Promise<void> {
    return await axios.delete(`${BASE_URL}/post/comments/${commentId}`, {
        withCredentials: true,
    });
}

export async function voteComment({
    id,
    isUpvote,
}: {
    id: number;
    isUpvote: boolean;
}) {
    const commentId = id;
    await axios.patch(`${BASE_URL}/post/comments/${commentId}/vote`, null, {
        params: { isUpvote },
        withCredentials: true,
    });
}

export async function replyToComment(
    commentId: number,
    replyData: ForumCommentDto,
) {
    return await axios.post(
        `${BASE_URL}/comments/${commentId}/replies`,
        replyData,
        {
            withCredentials: true,
        },
    );
}
