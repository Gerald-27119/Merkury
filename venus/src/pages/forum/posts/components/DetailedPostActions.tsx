import { MdThumbDown, MdThumbUp } from "react-icons/md";
import { FaComment, FaShare } from "react-icons/fa";
import AddCommentButton from "../../components/AddCommentButton";
import ActionIconWithCount from "./ActionIconWithCount";
import ForumPostMenu from "./ForumPostMenu";
import PostDetails from "../../../../model/interface/forum/post/postDetails";

interface DetailedPostActionsProps {
    post: PostDetails;
    onAddCommentClick: () => void;
    onDelete: (postId: number) => void;
    onEdit: () => void;
    onVote: (postId: number, isUpvote: boolean) => void;
    onFollow: (postId: number) => void;
    onReport: (postId: number) => void;
    onShare: (url: string) => void;
}

export default function DetailedPostActions({
    post,
    onAddCommentClick,
    onDelete,
    onEdit,
    onVote,
    onFollow,
    onReport,
    onShare,
}: DetailedPostActionsProps) {
    return (
        <div className="mt-2 flex items-center text-2xl">
            <div className="flex gap-6">
                <ActionIconWithCount
                    Icon={MdThumbUp}
                    data={post.upVotes}
                    isActive={post.isUpVoted}
                    onClick={() => onVote(post.id, true)}
                />
                <ActionIconWithCount
                    Icon={MdThumbDown}
                    data={post.downVotes}
                    isActive={post.isDownVoted}
                    onClick={() => onVote(post.id, false)}
                />
                <ActionIconWithCount
                    Icon={FaComment}
                    data={post.commentsCount}
                />

                <div className="flex cursor-pointer items-center gap-2 text-lg hover:text-blue-500 dark:hover:text-blue-400">
                    <FaShare onClick={() => onShare("debil")} />
                    <p>Share</p>
                </div>
            </div>

            <div className="ml-8 flex gap-6">
                <ForumPostMenu
                    post={post}
                    isAuthor={post.isAuthor}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onFollow={onFollow}
                    onReport={onReport}
                />
            </div>

            <AddCommentButton onClick={onAddCommentClick} />
        </div>
    );
}
