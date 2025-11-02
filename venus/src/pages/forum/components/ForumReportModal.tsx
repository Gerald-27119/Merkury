import { createPortal } from "react-dom";
import ForumReportForm from "./ForumReportForm";
import { useAppMutation } from "../../../hooks/useAppMutation";
import { reportPost } from "../../../http/posts";
import { ForumReportReason } from "../../../model/enum/forum/forumReportReason";
import { reportComment } from "../../../http/post-comments";

interface ForumReportModalProps {
    onClose: () => void;
    isOpen: boolean;
    reportTarget: { type: "post" | "comment"; id: number } | null;
}

export default function ForumReportModal({
    onClose,
    isOpen,
    reportTarget,
}: ForumReportModalProps) {
    const modalRoot = document.getElementById("modal");

    if (!modalRoot) {
        return null;
    }

    const { mutateAsync: reportPostMutate } = useAppMutation(reportPost, {
        successMessage: "Post reported successfully!",
        loginToAccessMessage: "Login to report posts.",
        errorMessages: {
            409: "You have already reported this post.",
        },
    });

    const { mutateAsync: reportCommentMutate } = useAppMutation(reportComment, {
        successMessage: "Comment reported successfully!",
        loginToAccessMessage: "Login to report comments.",
        errorMessages: {
            409: "You have already reported this comment.",
        },
    });

    const handleReport = async (reason: ForumReportReason, details: string) => {
        if (!reportTarget) return;

        const { type, id } = reportTarget;
        const report = { reason, details };

        switch (type) {
            case "post":
                await reportPostMutate({ postId: id, report });
                break;
            case "comment":
                await reportCommentMutate({ commentId: id, report });
                break;
            default:
                break;
        }
    };

    return createPortal(
        <div>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/70"
                        onClick={onClose}
                    ></div>
                    <ForumReportForm
                        handleReport={handleReport}
                        onClose={onClose}
                    />
                </>
            )}
        </div>,
        modalRoot,
    );
}
