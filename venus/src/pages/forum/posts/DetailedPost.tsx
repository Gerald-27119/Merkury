import PostDetails from "../../../model/interface/forum/post/postDetails";
import PostMetaData from "./components/PostMetaData";
import ForumContentHeader from "./components/ForumContentHeader";
import DetailedPostContent from "./components/DetailedPostContent";
import { useNavigate } from "react-router-dom";
import ForumContentActions from "../components/ForumContentActions";
import Error from "../../../components/error/Error";
import ForumLayout from "../components/ForumLayout";
import ReturnButton from "../components/ReturnButton";
import SkeletonDetailedPost from "./components/SkeletonDetailedPost";
import useForumEntityActions from "../../../hooks/useForumEntityActions";
import { deletePost, editPost, votePost } from "../../../http/posts";

interface DetailedPostProps {
    post: PostDetails;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    onClick: (id: number) => void;
}

export default function DetailedPost({
    post,
    isLoading,
    isError,
    error,
    onClick,
}: DetailedPostProps) {
    const navigate = useNavigate();

    const {
        handleEdit,
        handleDelete,
        handleFollow,
        handleReport,
        handleShare,
        handleVote,
    } = useForumEntityActions({
        entityName: "post",
        deleteFn: deletePost,
        voteFn: votePost,
        redirectOnDelete: true,
        queryKeys: { list: "posts", single: "post" },
    });

    const handleNavigateToAuthorProfile = () => {
        navigate(`/account/profile/${post.author.username}`);
    };

    const handlePostEdit = () => {};

    if (isLoading) {
        return (
            <ForumLayout>
                <div className="mx-auto w-xl md:w-2xl lg:w-3xl">
                    <ReturnButton />
                    <SkeletonDetailedPost />
                </div>
            </ForumLayout>
        );
    }

    if (isError) {
        return <Error error={error} />;
    }

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
                onClick={onClick}
                onDelete={handleDelete}
                onEdit={handlePostEdit}
                onVote={handleVote}
                onFollow={handleFollow}
                onReport={handleReport}
                onShare={handleShare}
                showAddCommentButton={true}
            />
        </div>
    );
}
