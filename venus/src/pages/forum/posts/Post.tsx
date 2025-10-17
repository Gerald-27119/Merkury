import PostGeneral from "../../../model/interface/forum/post/postGeneral";
import PostHeader from "./components/PostHeader";
import PostMetaData from "./components/PostMetaData";
import PostContent from "./components/PostContent";
import useForumEntityActions from "../../../hooks/useForumEntityActions";
import { deletePost, editPost } from "../../../http/posts";
import { ForumEntityPayloads } from "../../../model/interface/forum/forumEntityPayloads";

interface PostProps {
    post: PostGeneral;
}

export default function Post({ post }: PostProps) {
    const { handleEdit, handleDelete, handleFollow, handleReport } =
        useForumEntityActions<void, ForumEntityPayloads["editPost"]>({
            entityName: "post",
            editFn: editPost,
            deleteFn: deletePost,
            queryKeys: { list: "posts", single: "post" },
        });

    const handlePostEdit = (postId: number) => {};

    return (
        <div className="dark:bg-darkBgSoft mx-auto my-4 max-w-md rounded-xl shadow-md md:max-w-2xl">
            <div className="p-6">
                <PostHeader
                    post={post}
                    onDelete={handleDelete}
                    onEdit={handlePostEdit}
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
