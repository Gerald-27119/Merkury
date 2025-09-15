import PostGeneral from "../../../model/interface/forum/post/postGeneral";
import PostHeader from "./components/PostHeader";
import PostMetaData from "./components/PostMetaData";
import PostContent from "./components/PostContent";
import useForumPostActions from "../../../hooks/useForumPostActions";

interface PostProps {
    post: PostGeneral;
}

export default function Post({ post }: PostProps) {
    const { handleDelete, handleEdit, handleFollow, handleReport } =
        useForumPostActions();

    return (
        <div className="dark:bg-darkBgSoft mx-auto my-4 max-w-md rounded-xl shadow-md md:max-w-2xl">
            <div className="p-6">
                <PostHeader
                    post={post}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onFollow={handleFollow}
                    onReport={handleReport}
                />
                <PostMetaData category={post.category} tags={post.tags} />
                <PostContent
                    content={post.content}
                    views={post.views}
                    numberOfComments={post.numberOfComments}
                />
            </div>
        </div>
    );
}
