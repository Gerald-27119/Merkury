import PostGeneral from "../../../model/interface/forum/post/postGeneral";
import PostHeader from "./components/PostHeader";
import PostMetaData from "./components/PostMetaData";
import PostContent from "./components/PostContent";
import { deletePost, editPost, votePost } from "../../../http/posts";
import PostDetails from "../../../model/interface/forum/post/postDetails";
import { useAppMutation } from "../../../hooks/useAppMutation";
import PostDto from "../../../model/interface/forum/post/postDto";

interface PostProps {
    post: PostGeneral;
}

export default function Post({ post }: PostProps) {
    const { mutateAsync: editPostMutate } = useAppMutation(editPost, {
        successMessage: "Post updated successfully!",
        loginToAccessMessage: "Login to edit posts",
        invalidateKeys: [["posts"], ["post", post.id]],
    });

    const { mutateAsync: deletePostMutate } = useAppMutation(deletePost, {
        successMessage: "Post deleted successfully!",
        loginToAccessMessage: "Login to delete posts",
        invalidateKeys: [["posts"]],
    });

    const handleEditClick = (post: PostGeneral | PostDetails) => {};

    const handleEdit = async (postData: PostDto) => {
        await editPostMutate({ postId: post.id, postData });
    };

    const handleDelete = async (postId: number) => {
        await deletePostMutate(postId);
    };

    const handleFollow = async (postId: number) => {};

    const handleReport = async (postId: number) => {};

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
                    content={post.content}
                    views={post.views}
                    commentsCount={post.commentsCount}
                />
            </div>
        </div>
    );
}
