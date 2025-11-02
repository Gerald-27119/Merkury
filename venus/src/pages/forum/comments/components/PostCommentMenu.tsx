import ForumContentMenu from "../../posts/components/ForumContentMenu";
import PostCommentGeneral from "../../../../model/interface/forum/postComment/postCommentGeneral";

interface ForumCommentMenuProps {
    comment: PostCommentGeneral;
    onDelete: (commentId: number) => void;
    onEdit: (comment: PostCommentGeneral) => void;
    onReport: (commentId: number) => void;
}

export default function PostCommentMenu({
    comment,
    onDelete,
    onEdit,
    onReport,
}: ForumCommentMenuProps) {
    return (
        <ForumContentMenu
            contentId={comment.id}
            isUserAuthor={comment.isAuthor}
            onDelete={() => onDelete(comment.id)}
            onEdit={() => onEdit(comment)}
            onReport={() => onReport(comment.id)}
        />
    );
}
