import axios from "axios";
import { PostCommentSortOption } from "../model/enum/forum/postCommentSortOption";
import PostCommentPage from "../model/interface/forum/postComment/postCommentPage";
import PostCommentDto from "../model/interface/forum/postComment/postCommentDto";
import PostCommentReplyPage from "../model/interface/forum/postComment/postCommentReplyPage";
import ForumReportDto from "../model/interface/forum/forumReportDto";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getCommentsByPostId(
    postId: number,
    page: number,
    size: number,
    sortType: PostCommentSortOption,
): Promise<PostCommentPage> {
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
): Promise<PostCommentReplyPage> {
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
    newComment: PostCommentDto;
}) {
    return await axios.post(`${BASE_URL}/post/${postId}/comments`, newComment, {
        withCredentials: true,
    });
}

export async function editComment({
    commentId,
    commentData,
}: {
    commentId: number;
    commentData: PostCommentDto;
}) {
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
    await axios.patch(`${BASE_URL}/post/comments/${id}/vote`, null, {
        params: { isUpvote },
        withCredentials: true,
    });
}

export async function replyToComment({
    commentId,
    replyData,
}: {
    commentId: number;
    replyData: PostCommentDto;
}) {
    return await axios.post(
        `${BASE_URL}/comments/${commentId}/replies`,
        replyData,
        {
            withCredentials: true,
        },
    );
}

export async function reportComment(commentId: number, report: ForumReportDto) {
    return await axios.patch(
        `${BASE_URL}/post/comments/${commentId}/report`,
        report,
        {
            withCredentials: true,
        },
    );
}
