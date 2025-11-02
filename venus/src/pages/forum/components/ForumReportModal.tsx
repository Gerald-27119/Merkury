import { createPortal } from "react-dom";
import ForumReportForm from "./ForumReportForm";
import { useAppMutation } from "../../../hooks/useAppMutation";
import { reportPost } from "../../../http/posts";
import { ForumReportReason } from "../../../model/enum/forum/forumReportReason";

interface ForumReportModalProps {
    onClose: () => void;
    isOpen: boolean;
    contentId: number | null;
}

export default function ForumReportModal({
    onClose,
    isOpen,
    contentId,
}: ForumReportModalProps) {
    const modalRoot = document.getElementById("modal");

    if (!modalRoot) {
        return null;
    }

    const { mutateAsync: reportPostMutate } = useAppMutation(reportPost, {
        successMessage: "Post reported successfully!",
        loginToAccessMessage: "Login to report posts.",
    });

    const handleReport = async (reason: ForumReportReason, details: string) => {
        let report = { reason, details };
        await reportPostMutate({ postId: contentId!, report });
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
