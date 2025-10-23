import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";
import ForumContentHeader from "../posts/components/ForumContentHeader";
import { useNavigate } from "react-router-dom";
import ForumCommentContent from "./ForumCommentContent";
import ShowRepliesButton from "./ShowRepliesButton";
import { useQuery } from "@tanstack/react-query";
import {
    deleteComment,
    editComment,
    getCommentRepliesByCommentId,
    voteComment,
} from "../../../http/post-comments";
import { useBoolean } from "../../../hooks/useBoolean";
import ForumCommentList from "./ForumCommentList";
import useForumEntityActions from "../../../hooks/useForumEntityActions";
import ForumCommentActions from "./ForumCommentActions";
import ForumCommentForm from "./ForumCommentForm";
import { notificationAction } from "../../../redux/notification";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useState } from "react";
import { ForumEntityPayloads } from "../../../model/interface/forum/forumEntityPayloads";

interface ForumCommentProps {
    comment: ForumCommentGeneral;
}

type ActiveForm =
    | { type: "edit"; comment: ForumCommentGeneral }
    | { type: "reply"; parentCommentId: number }
    | null;

export default function ForumComment({ comment }: ForumCommentProps) {
    const navigate = useNavigate();
    const [areRepliesOpen, openReplies, closeReplies] = useBoolean(false);
    const [activeForm, setActiveForm] = useState<ActiveForm>(null);
    const dispatch = useDispatchTyped();
    const isLogged = useSelector((state: RootState) => state.account.isLogged);

    const { handleDelete, handleEdit, handleVote, handleReport, handleReply } =
        useForumEntityActions<void, ForumEntityPayloads["editComment"]>({
            entityName: "comment",
            queryKeys: { list: "forumComments", single: "comment" },
            deleteFn: deleteComment,
            voteFn: voteComment,
            editFn: editComment,
            redirectOnDelete: false,
        });

    const handleNavigateToAuthorProfile = () => {
        navigate(`/account/profile/${comment.author.username}`);
    };

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

    const handleCommentReplyClick = (commentId: number) => {
        if (isLogged) {
            setActiveForm({ type: "reply", parentCommentId: commentId });
        } else {
            dispatch(
                notificationAction.addInfo({ message: "Login to reply." }),
            );
        }
    };

    const {
        data: repliesPage,
        error: repliesPageError,
        isError: isRepliesPageError,
        isLoading: isRepliesPageLoading,
    } = useQuery({
        queryKey: [comment.id, "forumCommentsReplies"],
        queryFn: () => getCommentRepliesByCommentId(comment.id, 10),
        enabled: areRepliesOpen,
    });

    console.log(activeForm?.type);

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
                        handleEdit({
                            commentId: activeForm.comment.id,
                            commentData: data,
                        })
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
                        comments={repliesPage?.comments}
                        isLoading={isRepliesPageLoading}
                        isError={isRepliesPageError}
                        error={repliesPageError}
                        areReplies={true}
                    />
                </div>
            )}
        </div>
    );
}
