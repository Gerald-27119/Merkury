import PostDetails from "../../../model/interface/forum/post/postDetails";
import PostMetaData from "./components/PostMetaData";
import DetailedPostHeader from "./components/DetailedPostHeader";
import DetailedPostContent from "./components/DetailedPostContent";
import DetailedPostActions from "./components/DetailedPostActions";
import usePostActions from "../../../hooks/usePostActions";

interface DetailedPostProps {
    post: PostDetails;
}

export default function DetailedPost({ post }: DetailedPostProps) {
    const { handleDelete, handleEdit, handleFollow, handleReport } =
        usePostActions();

    return (
        <div className="dark:bg-darkBgSoft mx-auto mt-8 mb-4 max-w-3xl rounded-xl p-6 shadow-lg">
            <DetailedPostHeader
                author={post?.author}
                publishDate={post?.publishDate}
            />
            <div className="mt-4">
                <PostMetaData category={post?.category} tags={post?.tags} />
            </div>
            <DetailedPostContent title={post?.title} content={post?.content} />
            <DetailedPostActions
                postId={post?.id}
                isAuthor={post?.isAuthor}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onFollow={handleFollow}
                onReport={handleReport}
            />
        </div>
    );
}
