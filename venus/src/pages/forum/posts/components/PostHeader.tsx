import PostMenu from "./PostMenu";
import PostGeneral from "../../../../model/interface/forum/post/postGeneral";
import { NavLink } from "react-router-dom";

interface PostHeaderProps {
    post: PostGeneral;
    onDelete: (postId: number) => void;
    onEdit: (postId: number) => void;
    onFollow: (postId: number) => void;
    onReport: (postId: number) => void;
}

export default function PortHeader({
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
            <PostMenu
                postId={post.id}
                isUserAuthor={post.isAuthor}
                onDelete={onDelete}
                onEdit={onEdit}
                onFollow={onFollow}
                onReport={onReport}
            />
        </div>
    );
}
