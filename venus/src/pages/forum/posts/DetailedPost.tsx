import PostDetails from "../../../model/interface/forum/post/postDetails";
import PostMetaData from "./components/PostMetaData";
import DetailedPostHeader from "./components/DetailedPostHeader";
import DetailedPostContent from "./components/DetailedPostContent";
import DetailedPostActions from "./components/DetailedPostActions";
import useForumPostActions from "../../../hooks/useForumPostActions";
import { useNavigate } from "react-router-dom";
import ReturnButton from "../components/ReturnButton";

interface DetailedPostProps {
    post: PostDetails;
}

export default function DetailedPost({ post }: DetailedPostProps) {
    const { handleDelete, handleEdit, handleFollow, handleReport } =
        useForumPostActions({ redirectOnDelete: true });
    const navigate = useNavigate();

    const handleNavigateToAuthorProfile = () => {
        navigate(`/account/profile/${post.author.username}`);
    };

    return (
        <div className="dark:bg-darkBgSoft mx-auto mb-4 rounded-xl p-6 shadow-lg">
            <DetailedPostHeader
                author={post.author}
                publishDate={post.publishDate}
                onAuthorClick={handleNavigateToAuthorProfile}
            />
            <div className="mt-4">
                <PostMetaData category={post.category} tags={post.tags} />
            </div>
            <DetailedPostContent title={post.title} content={post.content} />
            <DetailedPostActions
                postId={post.id}
                isAuthor={post.isAuthor}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onFollow={handleFollow}
                onReport={handleReport}
            />
        </div>
    );
}
