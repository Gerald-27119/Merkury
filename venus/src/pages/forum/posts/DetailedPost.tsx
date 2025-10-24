import PostDetails from "../../../model/interface/forum/post/postDetails";
import PostMetaData from "./components/PostMetaData";
import ForumContentHeader from "./components/ForumContentHeader";
import DetailedPostContent from "./components/DetailedPostContent";
import { useNavigate } from "react-router-dom";
import Error from "../../../components/error/Error";
import ForumLayout from "../components/ForumLayout";
import ReturnButton from "../components/ReturnButton";
import SkeletonDetailedPost from "./components/SkeletonDetailedPost";
import DetailedPostActions from "./components/DetailedPostActions";
import { deletePost, editPost, votePost } from "../../../http/posts";
import { notificationAction } from "../../../redux/notification";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { useAppMutation } from "../../../hooks/useAppMutation";

interface DetailedPostProps {
    post: PostDetails;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    onAddCommentClick: () => void;
}

export default function DetailedPost({
    post,
    isLoading,
    isError,
    error,
    onAddCommentClick,
}: DetailedPostProps) {
    const navigate = useNavigate();
    const dispatch = useDispatchTyped();

    const { mutateAsync: editPostMutate } = useAppMutation(editPost, {
        successMessage: "Post updated successfully!",
        loginToAccessMessage: "Login to edit posts",
        invalidateKeys: [["posts"], ["post", 1]],
    });

    const { mutateAsync: deletePostMutate } = useAppMutation(deletePost, {
        successMessage: "Post deleted successfully!",
        loginToAccessMessage: "Login to delete posts",
        invalidateKeys: [["posts"]],
    });

    const { mutateAsync: votePostMutate } = useAppMutation(votePost, {
        invalidateKeys: [["post"]],
        loginToAccessMessage: "Login to vote",
    });

    const handleEditClick = async (post: PostDetails) => {};

    const handleDelete = async (postId: number) => {
        await deletePostMutate(postId);
        navigate(`/forum`);
    };

    const handleVote = async (id: number, isUpvote: boolean) => {
        await votePostMutate({ id, isUpvote });
    };

    const handleFollow = async (postId: number) => {};

    const handlePostShare = async (url: string) => {
        await navigator.clipboard.writeText(url);
        dispatch(
            notificationAction.addSuccess({
                message: "Copied to clipboard!",
            }),
        );
    };

    const handleReport = async (postId: number) => {};

    const handleNavigateToAuthorProfile = () => {
        navigate(`/account/profile/${post.author.username}`);
    };

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

            <DetailedPostActions
                post={post}
                onAddCommentClick={onAddCommentClick}
                onDelete={handleDelete}
                onEdit={handleEditClick}
                onVote={handleVote}
                onFollow={handleFollow}
                onReport={handleReport}
                onShare={handlePostShare}
            />
        </div>
    );
}
