import ForumContentMenu from "../posts/components/ForumContentMenu";
import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";

interface ForumCommentMenuProps {
    comment: ForumCommentGeneral;
    onDelete: (commentId: number) => void;
    onEdit: (comment: ForumCommentGeneral) => void;
    onReport: (commentId: number) => void;
}

export default function ForumCommentMenu({
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
