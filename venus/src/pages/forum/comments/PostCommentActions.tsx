import ActionIconWithCount from "../posts/components/ActionIconWithCount";
import { MdThumbDown, MdThumbUp } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import PostCommentGeneral from "../../../model/interface/forum/postComment/postCommentGeneral";
import PostCommentMenu from "./PostCommentMenu";

interface ForumCommentActionsProps {
    comment: PostCommentGeneral;
    onDelete: (commentId: number) => void;
    onEdit: (comment: PostCommentGeneral) => void;
    onVote: (commentId: number, isUpvote: boolean) => void;
    onReport: (commentId: number) => void;
    onReply: (commentId: number) => void;
}

export default function PostCommentActions({
    comment,
    onDelete,
    onEdit,
    onVote,
    onReport,
    onReply,
}: ForumCommentActionsProps) {
    return (
        <div className="mt-4 flex items-center text-2xl">
            <div className="flex gap-6">
                <ActionIconWithCount
                    Icon={MdThumbUp}
                    data={comment.upVotes}
                    isActive={comment.isUpVoted}
                    onClick={() => onVote(comment.id, true)}
                />
                <ActionIconWithCount
                    Icon={MdThumbDown}
                    data={comment.downVotes}
                    isActive={comment.isDownVoted}
                    onClick={() => onVote(comment.id, false)}
                />

                {!comment.isAuthor && (
                    <div
                        className="flex cursor-pointer items-center gap-2 text-lg hover:text-blue-500 dark:hover:text-blue-400"
                        onClick={() => onReply(comment.id)}
                    >
                        <FaReply />
                        <p>Reply</p>
                    </div>
                )}
            </div>
            <div className="ml-8 flex gap-6">
                <PostCommentMenu
                    comment={comment}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onReport={onReport}
                />
            </div>
        </div>
    );
}
