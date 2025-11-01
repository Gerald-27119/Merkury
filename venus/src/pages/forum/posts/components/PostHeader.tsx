import PostGeneral from "../../../../model/interface/forum/post/postGeneral";
import { NavLink } from "react-router-dom";
import ForumPostMenu from "./ForumPostMenu";

interface PostHeaderProps {
    post: PostGeneral;
    onDelete: (postId: number) => void;
    onEdit: (post: PostGeneral) => void;
    onFollow: (postId: number) => void;
    onReport: (postId: number) => void;
}

export default function PostHeader({
    post,
    onDelete,
    onEdit,
    onFollow,
    onReport,
}: PostHeaderProps) {
    return (
        <div className="flex items-start justify-between">
            <NavLink to={`/forum/${post.id}/${post.slugTitle}`}>
                <h2 className="dark:hover:text-lightBgSoft cursor-pointer text-xl font-bold">
                    {post.title}
                </h2>
            </NavLink>
            <ForumPostMenu
                post={post}
                onDelete={onDelete}
                onEdit={onEdit}
                onFollow={onFollow}
                onReport={onReport}
            />
        </div>
    );
}
