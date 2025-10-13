import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";
import ForumContentHeader from "../posts/components/ForumContentHeader";
import { useNavigate } from "react-router-dom";
import ForumCommentContent from "./ForumCommentContent";
import { MdKeyboardArrowDown, MdThumbUp } from "react-icons/md";
import ActionIconWithCount from "../posts/components/ActionIconWithCount";
import ForumContentActions from "../components/ForumContentActions";
import ShowRepliesButton from "./ShowRepliesButton";

interface ForumCommentProps {
    comment: ForumCommentGeneral;
}

export default function ForumComment({ comment }: ForumCommentProps) {
    const navigate = useNavigate();

    const handleNavigateToAuthorProfile = () => {
        navigate(`/account/profile/${comment.author.username}`);
    };

    const handlesmth = () => {};

    return (
        <div className="">
            <ForumContentHeader
                author={comment.author}
                publishDate={comment.publishDate}
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
                onDelete={handlesmth}
                onEdit={handlesmth}
                onVote={handlesmth}
                onReport={handlesmth}
                onReply={handlesmth}
            />

            <div className="flex items-center">
                {comment.repliesCount > 0 && (
                    <div>
                        <ShowRepliesButton data={comment.repliesCount} />
                    </div>
                )}
            </div>
        </div>
    );
}
