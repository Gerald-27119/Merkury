import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";
import ForumContentHeader from "../posts/components/ForumContentHeader";
import { useNavigate } from "react-router-dom";
import ForumCommentContent from "./ForumCommentContent";
import { BsArrowReturnRight } from "react-icons/bs";
import ShowRepliesButton from "./ShowRepliesButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
    deleteComment,
    editComment,
    getCommentRepliesByCommentId,
    replyToComment,
    voteComment,
} from "../../../http/post-comments";
import { useBoolean } from "../../../hooks/useBoolean";
import ForumCommentList from "./ForumCommentList";
import ForumCommentActions from "./ForumCommentActions";
import ForumCommentForm from "./ForumCommentForm";
import { notificationAction } from "../../../redux/notification";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useState } from "react";
import { useAppMutation } from "../../../hooks/useAppMutation";
import ForumCommentDto from "../../../model/interface/forum/postComment/forumCommentDto";
import ForumCommentReplyPage from "../../../model/interface/forum/postComment/forumCommentReplyPage";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";

interface ForumCommentProps {
    comment: ForumCommentGeneral;
    postId?: number;
    parentCommentId?: number;
}

type ActiveForm =
    | { type: "edit"; comment: ForumCommentGeneral }
    | { type: "reply"; parentCommentId: number }
    | null;

export default function ForumComment({
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

    const handleCommentEditClick = (comment: ForumCommentGeneral) => {
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
        commentData: ForumCommentDto,
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
        replyData: ForumCommentDto,
    ) => {
        console.log();
        await replyCommentMutate({ commentId, replyData });
    };

    const handleReport = async (commentId: number) => {};

    const {
        data: repliesPage,
        error: repliesPageError,
        isError: isRepliesPageError,
        isLoading: isRepliesPageLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<ForumCommentReplyPage, Error>({
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
        (page: ForumCommentReplyPage) => page.comments ?? [],
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
                    <ForumCommentContent content={comment.content} />

                    <ForumCommentActions
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
                <ForumCommentForm
                    handleComment={(data) =>
                        handleEdit(activeForm.comment.id, data)
                    }
                    onClose={() => setActiveForm(null)}
                    commentToEdit={activeForm.comment}
                    className="mt-4"
                />
            )}

            {activeForm?.type === "reply" && (
                <ForumCommentForm
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
                    <ForumCommentList
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
