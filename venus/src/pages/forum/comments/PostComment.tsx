import PostCommentGeneral from "../../../model/interface/forum/postComment/postCommentGeneral";
import ForumContentHeader from "../posts/components/ForumContentHeader";
import { useNavigate } from "react-router-dom";
import PostCommentContent from "./components/PostCommentContent";
import { BsArrowReturnRight } from "react-icons/bs";
import ShowRepliesButton from "./components/ShowRepliesButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
    deleteComment,
    editComment,
    getCommentRepliesByCommentId,
    replyToComment,
    voteComment,
} from "../../../http/post-comments";
import { useBoolean } from "../../../hooks/useBoolean";
import PostCommentList from "./components/PostCommentList";
import PostCommentActions from "./components/PostCommentActions";
import PostCommentForm from "./components/PostCommentForm";
import { notificationAction } from "../../../redux/notification";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useState } from "react";
import { useAppMutation } from "../../../hooks/useAppMutation";
import PostCommentDto from "../../../model/interface/forum/postComment/postCommentDto";
import PostCommentReplyPage from "../../../model/interface/forum/postComment/postCommentReplyPage";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import { forumReportModalAction } from "../../../redux/forumReportModal";

interface ForumCommentProps {
    comment: PostCommentGeneral;
    postId?: number;
    parentCommentId?: number;
}

type ActiveForm =
    | { type: "edit"; comment: PostCommentGeneral }
    | { type: "reply"; parentCommentId: number }
    | null;

export default function PostComment({
    comment,
    postId,
    parentCommentId,
}: ForumCommentProps) {
    const navigate = useNavigate();
    const [areRepliesOpen, openReplies, closeReplies] = useBoolean(false);
    const [activeForm, setActiveForm] = useState<ActiveForm>(null);
    const dispatch = useDispatchTyped();
    const isLogged = useSelector((state: RootState) => state.account.isLogged);

    const handleNavigateToAuthorProfile = () => {
        navigate(`/account/profile/${comment.author.username}`);
    };

    const { mutateAsync: editCommentMutate } = useAppMutation(editComment, {
        successMessage: "Comment updated successfully!",
        invalidateKeys: [
            ...(!parentCommentId
                ? [["forumComments", postId]]
                : [["forumCommentReplies", parentCommentId]]),
        ],
        loginToAccessMessage: "Login to comment",
    });

    const { mutateAsync: deleteCommentMutate } = useAppMutation(deleteComment, {
        successMessage: "Comment deleted successfully!",
        invalidateKeys: [
            ...(!parentCommentId
                ? [["forumComments", postId]]
                : [["forumCommentReplies", parentCommentId]]),
        ],
        loginToAccessMessage: "Login to comment",
    });

    const { mutateAsync: voteCommentMutate } = useAppMutation(voteComment, {
        invalidateKeys: [
            ...(!parentCommentId
                ? [["forumComments", postId]]
                : [["forumCommentReplies", parentCommentId]]),
        ],
        loginToAccessMessage: "Login to vote",
    });

    const { mutateAsync: replyCommentMutate } = useAppMutation(replyToComment, {
        successMessage: "Replied successfully!",
        invalidateKeys: [
            ["forumComments", postId],
            ...(!parentCommentId
                ? [["forumCommentReplies", comment.id]]
                : [["forumCommentReplies", parentCommentId]]),
        ],
        loginToAccessMessage: "Login to comment",
    });

    const handleCommentEditClick = (comment: PostCommentGeneral) => {
        if (isLogged) {
            setActiveForm({ type: "edit", comment });
        } else {
            dispatch(
                notificationAction.addInfo({
                    message: "Login to comment.",
                }),
            );
        }
    };

    const handleEdit = async (
        commentId: number,
        commentData: PostCommentDto,
    ) => {
        await editCommentMutate({ commentId, commentData });
    };

    const handleDelete = async (commentId: number) => {
        await deleteCommentMutate(commentId);
    };

    const handleVote = async (id: number, isUpvote: boolean) => {
        await voteCommentMutate({ id, isUpvote });
    };

    const handleCommentReplyClick = (commentId: number) => {
        if (isLogged) {
            setActiveForm({ type: "reply", parentCommentId: commentId });
        } else {
            dispatch(
                notificationAction.addInfo({ message: "Login to reply." }),
            );
        }
    };

    const handleReply = async (
        commentId: number,
        replyData: PostCommentDto,
    ) => {
        console.log();
        await replyCommentMutate({ commentId, replyData });
    };

    const handleReport = async (commentId: number) => {
        dispatch(
            forumReportModalAction.openReportModal({
                type: "comment",
                id: commentId,
            }),
        );
    };

    const {
        data: repliesPage,
        error: repliesPageError,
        isError: isRepliesPageError,
        isLoading: isRepliesPageLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<PostCommentReplyPage>({
        queryKey: ["forumCommentReplies", comment.id],
        queryFn: (context) => {
            const { pageParam } = context as {
                pageParam?: { lastDate?: string; lastId?: number };
            };

            return getCommentRepliesByCommentId(
                comment.id,
                10,
                pageParam?.lastDate,
                pageParam?.lastId,
            );
        },
        getNextPageParam: (lastPage) => {
            return lastPage.nextCursorId
                ? {
                      lastId: lastPage.nextCursorId,
                      lastDate: lastPage.nextCursorDate,
                  }
                : undefined;
        },
        initialPageParam: undefined,
        enabled: areRepliesOpen,
    });

    const replies = repliesPage?.pages.flatMap(
        (page: PostCommentReplyPage) => page.comments ?? [],
    );

    return (
        <div>
            <ForumContentHeader
                author={comment.author}
                publishDate={comment.publishDate}
                isReply={comment.isReply}
                onAuthorClick={handleNavigateToAuthorProfile}
            />

            {activeForm?.type !== "edit" && (
                <div>
                    <PostCommentContent content={comment.content} />

                    <PostCommentActions
                        comment={comment}
                        onDelete={handleDelete}
                        onEdit={handleCommentEditClick}
                        onVote={handleVote}
                        onReport={handleReport}
                        onReply={handleCommentReplyClick}
                    />
                </div>
            )}

            {activeForm?.type === "edit" && activeForm.comment && (
                <PostCommentForm
                    handleComment={(data) =>
                        handleEdit(activeForm.comment.id, data)
                    }
                    onClose={() => setActiveForm(null)}
                    commentToEdit={activeForm.comment}
                    className="mt-4"
                />
            )}

            {activeForm?.type === "reply" && (
                <PostCommentForm
                    handleComment={(data) =>
                        handleReply(activeForm.parentCommentId, data)
                    }
                    onClose={() => setActiveForm(null)}
                    className="mt-4"
                />
            )}

            {comment.repliesCount != null && comment.repliesCount > 0 && (
                <div className="flex items-center">
                    <div>
                        <ShowRepliesButton
                            data={comment.repliesCount}
                            isOpen={areRepliesOpen}
                            onClick={
                                areRepliesOpen ? closeReplies : openReplies
                            }
                        />
                    </div>
                </div>
            )}

            {areRepliesOpen && (
                <div className="ml-10">
                    <PostCommentList
                        comments={replies}
                        isLoading={isRepliesPageLoading}
                        isError={isRepliesPageError}
                        error={repliesPageError}
                        areReplies={true}
                        parentCommentId={comment.id}
                    />
                    <div className="text-lg text-blue-400">
                        {hasNextPage && !isFetchingNextPage && (
                            <button
                                onClick={() => fetchNextPage()}
                                className="flex cursor-pointer items-center gap-2"
                            >
                                <BsArrowReturnRight />
                                <p>Load more replies</p>
                            </button>
                        )}

                        {isFetchingNextPage && <LoadingSpinner />}
                    </div>
                </div>
            )}
        </div>
    );
}
