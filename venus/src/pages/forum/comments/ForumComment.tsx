import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";
import ForumContentHeader from "../posts/components/ForumContentHeader";
import { useNavigate } from "react-router-dom";
import ForumCommentContent from "./ForumCommentContent";
import ShowRepliesButton from "./ShowRepliesButton";
import { useQuery } from "@tanstack/react-query";
import {
    deleteComment,
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

interface ForumCommentProps {
    comment: ForumCommentGeneral;
}

export default function ForumComment({ comment }: ForumCommentProps) {
    const navigate = useNavigate();
    const [commentToEdit, setCommentToEdit] = useState({
        content: "",
    });
    const [areRepliesOpen, openReplies, closeReplies] = useBoolean(false);
    const [isEditingFormVisible, showEditForm, hideEditForm] =
        useBoolean(false);
    const dispatch = useDispatchTyped();
    const isLogged = useSelector((state: RootState) => state.account.isLogged);

    const { handleDelete, handleEdit, handleVote, handleReport, handleReply } =
        useForumEntityActions({
            entityName: "comment",
            queryKeys: { list: "forumComments", single: "comment" },
            deleteFn: deleteComment,
            voteFn: voteComment,
            redirectOnDelete: false,
        });

    const handleNavigateToAuthorProfile = () => {
        navigate(`/account/profile/${comment.author.username}`);
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

    const handleCommentEdit = () => {};

    const handleCommentEditClick = (comment: ForumCommentGeneral) => {
        if (isLogged) {
            setCommentToEdit(comment);
            isEditingFormVisible ? hideEditForm() : showEditForm();
        } else {
            dispatch(
                notificationAction.addInfo({
                    message: "Login to edit comments.",
                }),
            );
        }
    };

    const handleCommentReply = () => {};

    return (
        <div>
            <ForumContentHeader
                author={comment.author}
                publishDate={comment.publishDate}
                isReply={comment.isReply}
                onAuthorClick={handleNavigateToAuthorProfile}
            />
            {!isEditingFormVisible && (
                <div>
                    <ForumCommentContent content={comment.content} />

                    <ForumCommentActions
                        comment={comment}
                        onDelete={handleDelete}
                        onEdit={handleCommentEditClick}
                        onVote={handleVote}
                        onReport={handleReport}
                        onReply={handleCommentReply}
                    />
                </div>
            )}

            {isEditingFormVisible && (
                <ForumCommentForm
                    handleComment={handleCommentEdit}
                    onClose={hideEditForm}
                    commentToEdit={commentToEdit}
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
