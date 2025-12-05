import PostGeneral from "../../../model/interface/forum/post/postGeneral";
import PostHeader from "./components/PostHeader";
import PostMetaData from "./components/PostMetaData";
import PostContent from "./components/PostContent";
import { deletePost, followPost } from "../../../http/posts";
import { useAppMutation } from "../../../hooks/useAppMutation";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { forumModalAction } from "../../../redux/forumModal";
import { forumReportModalAction } from "../../../redux/forumReportModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { notificationAction } from "../../../redux/notification";

interface PostProps {
    post: PostGeneral;
}

export default function Post({ post }: PostProps) {
    const dispatch = useDispatchTyped();
    const isLogged = useSelector((state: RootState) => state.account.isLogged);

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
        invalidateKeys: [["posts"], ["followedPosts"]],
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
        if (isLogged) {
            await followPostMutate(postId);
        } else {
            dispatch(
                notificationAction.addInfo({
                    message: "Login to follow posts.",
                }),
            );
        }
    };

    const handleReport = async (postId: number) => {
        if (isLogged) {
            dispatch(
                forumReportModalAction.openReportModal({
                    type: "post",
                    id: postId,
                }),
            );
        } else {
            dispatch(
                notificationAction.addInfo({
                    message: "Login to report posts.",
                }),
            );
        }
    };

    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft mx-auto my-4 max-w-md rounded-xl shadow-md md:max-w-2xl">
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
