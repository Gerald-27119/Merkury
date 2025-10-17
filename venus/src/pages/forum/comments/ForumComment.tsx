import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";
import ForumContentHeader from "../posts/components/ForumContentHeader";
import { useNavigate } from "react-router-dom";
import ForumCommentContent from "./ForumCommentContent";
import ForumContentActions from "../components/ForumContentActions";
import ShowRepliesButton from "./ShowRepliesButton";
import useForumPostActions from "../../../hooks/useForumPostActions";
import { useQuery } from "@tanstack/react-query";
import {
    deleteComment,
    getCommentRepliesByCommentId,
    voteComment,
} from "../../../http/post-comments";
import { useBoolean } from "../../../hooks/useBoolean";
import ForumCommentList from "./ForumCommentList";
import useForumEntityActions from "../../../hooks/useForumEntityActions";

interface ForumCommentProps {
    comment: ForumCommentGeneral;
}

export default function ForumComment({ comment }: ForumCommentProps) {
    const navigate = useNavigate();
    const [areRepliesOpen, openReplies, closeReplies] = useBoolean(false);

    // const { handleDelete, handleEdit, handleVote, handleReport, handleReply } =
    //     useForumPostActions({ redirectOnDelete: false });

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

    return (
        <div>
            <ForumContentHeader
                author={comment.author}
                publishDate={comment.publishDate}
                isReply={comment.isReply}
                onAuthorClick={handleNavigateToAuthorProfile}
            />
            <ForumCommentContent content={comment.content} />
            <ForumContentActions
                contentId={comment.id}
                isAuthor={comment.isAuthor}
                upVotes={comment.upVotes}
                downVotes={comment.downVotes}
                isUpVoted={comment.isUpVoted}
                isDownVoted={comment.isDownVoted}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onVote={handleVote}
                onReport={handleReport}
                onReply={handleReply}
            />

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
