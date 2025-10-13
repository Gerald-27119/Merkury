import PostDetails from "../../../model/interface/forum/post/postDetails";
import PostMetaData from "./components/PostMetaData";
import ForumContentHeader from "./components/ForumContentHeader";
import DetailedPostContent from "./components/DetailedPostContent";
import useForumPostActions from "../../../hooks/useForumPostActions";
import { useNavigate } from "react-router-dom";
import ForumContentActions from "../components/ForumContentActions";

interface DetailedPostProps {
    post: PostDetails;
}

export default function DetailedPost({ post }: DetailedPostProps) {
    const {
        handleDelete,
        handleEdit,
        handleVote,
        handleFollow,
        handleReport,
        handleShare,
    } = useForumPostActions({ redirectOnDelete: true });
    const navigate = useNavigate();

    const handleNavigateToAuthorProfile = () => {
        navigate(`/account/profile/${post.author.username}`);
    };

    return (
        <div className="dark:bg-darkBgSoft mx-auto mb-4 rounded-xl p-6 shadow-lg">
            <ForumContentHeader
                author={post.author}
                publishDate={post.publishDate}
                onAuthorClick={handleNavigateToAuthorProfile}
            />
            <div className="mt-4">
                <PostMetaData category={post.category} tags={post.tags} />
            </div>
            <DetailedPostContent title={post.title} content={post.content} />
            <ForumContentActions
                contentId={post.id}
                isAuthor={post.isAuthor}
                upVotes={post.upVotes}
                downVotes={post.downVotes}
                isUpVoted={post.isUpVoted}
                isDownVoted={post.isDownVoted}
                commentsCount={post.commentsCount}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onVote={handleVote}
                onFollow={handleFollow}
                onReport={handleReport}
                onShare={handleShare}
                showAddCommentButton={true}
            />
        </div>
    );
}
