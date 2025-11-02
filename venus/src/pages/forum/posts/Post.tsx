import PostGeneral from "../../../model/interface/forum/post/postGeneral";
import PostHeader from "./components/PostHeader";
import PostMetaData from "./components/PostMetaData";
import PostContent from "./components/PostContent";
import { deletePost, followPost } from "../../../http/posts";
import { useAppMutation } from "../../../hooks/useAppMutation";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { forumModalAction } from "../../../redux/forumModal";
import { forumReportModalAction } from "../../../redux/forumReportModal";

interface PostProps {
    post: PostGeneral;
}

export default function Post({ post }: PostProps) {
    const dispatch = useDispatchTyped();

    const { mutateAsync: deletePostMutate } = useAppMutation(deletePost, {
        successMessage: "Post deleted successfully!",
        loginToAccessMessage: "Login to delete posts",
        invalidateKeys: [["posts"]],
    });

    const { mutateAsync: followPostMutate } = useAppMutation(followPost, {
        successMessage: post.isFollowed
            ? "Post is no longer being followed!"
            : "Post is now being followed!",
        loginToAccessMessage: "Login to follow posts.",
        invalidateKeys: [["posts"]],
    });

    const handleEditClick = (post: PostGeneral) => {
        let postToEdit = {
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category.name,
            tags: post.tags.map((tag) => tag.name),
        };
        dispatch(forumModalAction.openEditModal(postToEdit));
    };

    const handleDelete = async (postId: number) => {
        await deletePostMutate(postId);
    };

    const handleFollow = async (postId: number) => {
        await followPostMutate(postId);
    };

    const handleReport = async (postId: number) => {
        dispatch(
            forumReportModalAction.openReportModal({
                type: "post",
                id: postId,
            }),
        );
    };

    return (
        <div className="dark:bg-darkBgSoft mx-auto my-4 max-w-md rounded-xl shadow-md md:max-w-2xl">
            <div className="p-6">
                <PostHeader
                    post={post}
                    onDelete={handleDelete}
                    onEdit={handleEditClick}
                    onFollow={handleFollow}
                    onReport={handleReport}
                />
                <PostMetaData category={post.category} tags={post.tags} />
                <PostContent
                    content={post.summaryContent}
                    views={post.views}
                    commentsCount={post.commentsCount}
                />
            </div>
        </div>
    );
}
