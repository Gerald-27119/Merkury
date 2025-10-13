import ActionIconWithCount from "../posts/components/ActionIconWithCount";
import { MdThumbDown, MdThumbUp } from "react-icons/md";
import { FaComment, FaShare, FaReply } from "react-icons/fa";
import ForumContentMenu from "../posts/components/ForumContentMenu";
import AddCommentButton from "./AddCommentButton";

interface ForumContentActionsProps {
    contentId: number;
    isAuthor: boolean;
    upVotes: number;
    downVotes: number;
    isUpVoted: boolean;
    isDownVoted: boolean;

    onVote: (id: number, isUpvote: boolean) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
    onReport: (id: number) => void;

    commentsCount?: number;
    onFollow?: (id: number) => void;
    onReply?: () => void;
    onShare?: () => void;
    showAddCommentButton?: boolean;
}

export default function ForumContentActions({
    contentId,
    isAuthor,
    upVotes,
    downVotes,
    isUpVoted,
    isDownVoted,
    commentsCount,
    onVote,
    onDelete,
    onEdit,
    onReport,
    onFollow,
    onReply,
    onShare,
    showAddCommentButton,
}: ForumContentActionsProps) {
    return (
        <div className="mt-2 flex items-center text-2xl">
            <div className="flex gap-6">
                <ActionIconWithCount
                    Icon={MdThumbUp}
                    data={upVotes}
                    isActive={isUpVoted}
                    onClick={() => onVote(contentId, true)}
                />
                <ActionIconWithCount
                    Icon={MdThumbDown}
                    data={downVotes}
                    isActive={isDownVoted}
                    onClick={() => onVote(contentId, false)}
                />

                {commentsCount !== undefined && (
                    <ActionIconWithCount
                        Icon={FaComment}
                        data={commentsCount}
                    />
                )}
            </div>

            <div className="ml-8 flex gap-6">
                {onReply && (
                    <div className="flex cursor-pointer items-center gap-2 text-lg hover:text-blue-500 dark:hover:text-blue-400">
                        <FaReply onClick={onReply} />
                        <p>Reply</p>
                    </div>
                )}

                {onShare && (
                    <FaShare
                        onClick={onShare}
                        className="cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                    />
                )}

                <ForumContentMenu
                    contentId={contentId}
                    isUserAuthor={isAuthor}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onReport={onReport}
                    onFollow={onFollow}
                />
            </div>

            {showAddCommentButton && <AddCommentButton />}
        </div>
    );
}
