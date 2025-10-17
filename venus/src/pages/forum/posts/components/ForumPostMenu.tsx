import ForumContentMenu from "./ForumContentMenu";
import PostGeneral from "../../../../model/interface/forum/post/postGeneral";
import PostDetails from "../../../../model/interface/forum/post/postDetails";

interface ForumPostMenuProps<T extends PostGeneral | PostDetails> {
    post: T;
    isAuthor: boolean;
    onDelete: (postId: number) => void;
    onEdit: (post: T) => void;
    onFollow: (postId: number) => void;
    onReport: (postId: number) => void;
}

export default function ForumPostMenu<T extends PostGeneral | PostDetails>({
    post,
    isAuthor,
    onDelete,
    onEdit,
    onFollow,
    onReport,
}: ForumPostMenuProps<T>) {
    return (
        <ForumContentMenu
            contentId={post.id}
            isUserAuthor={isAuthor}
            onDelete={() => onDelete(post.id)}
            onEdit={() => onEdit(post)}
            onFollow={() => onFollow(post.id)}
            onReport={() => onReport(post.id)}
        />
    );
}
