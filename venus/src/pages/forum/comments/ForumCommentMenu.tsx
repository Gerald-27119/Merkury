import ForumContentMenu from "../posts/components/ForumContentMenu";
import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";

interface ForumCommentMenuProps {
    comment: ForumCommentGeneral;
    isAuthor: boolean;
    onDelete: (commentId: number) => void;
    onEdit: (comment: ForumCommentGeneral) => void;
    onReport: (commentId: number) => void;
}

export default function ForumCommentMenu({
    comment,
    isAuthor,
    onDelete,
    onEdit,
    onReport,
}: ForumCommentMenuProps) {
    return (
        <ForumContentMenu
            contentId={comment.id}
            isUserAuthor={isAuthor}
            onDelete={() => onDelete(comment.id)}
            onEdit={() => onEdit(comment)}
            onReport={() => onReport(comment.id)}
        />
    );
}
