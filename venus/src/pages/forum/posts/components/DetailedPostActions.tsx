import { MdThumbDown, MdThumbUp } from "react-icons/md";
import { FaComment, FaShare } from "react-icons/fa";
import PostMenu from "./PostMenu";
import AddCommentButton from "../../components/AddCommentButton";

interface DetailedPostActionsProps {
    postId: number;
    isAuthor: boolean;
    onDelete: (postId: number) => void;
    onEdit: (postId: number) => void;
    onFollow: (postId: number) => void;
    onReport: (postId: number) => void;
}

export default function DetailedPostActions({
    postId,
    isAuthor,
    onDelete,
    onEdit,
    onFollow,
    onReport,
}: DetailedPostActionsProps) {
    return (
        <div className="mt-2 flex items-center gap-12 text-2xl">
            <MdThumbUp className="cursor-pointer hover:text-blue-500" />
            <MdThumbDown className="cursor-pointer hover:text-blue-500" />
            <FaComment className="cursor-pointer hover:text-blue-500" />
            <FaShare className="cursor-pointer hover:text-blue-500" />
            <PostMenu
                postId={postId}
                isUserAuthor={isAuthor}
                onDelete={onDelete}
                onEdit={onEdit}
                onFollow={onFollow}
                onReport={onReport}
            />
            <AddCommentButton />
        </div>
    );
}
