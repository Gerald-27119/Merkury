import { createPortal } from "react-dom";
import ForumCategoryDto from "../../../model/interface/forum/forumCategoryDto";
import ForumTagDto from "../../../model/interface/forum/forumTagDto";
import PostForm from "../posts/components/PostForm";

interface ModalProps {
    onClose: () => void;
    isOpen: boolean;
    categories: ForumCategoryDto[];
    tags: ForumTagDto[];
}

export default function ForumFormModal({
    onClose,
    isOpen,
    categories,
    tags,
}: ModalProps) {
    const modalRoot = document.getElementById("modal");

    if (!modalRoot) {
        return null;
    }

    const categoryOptions = categories.map((category) => ({
        value: category.name,
        label: category.name,
    }));

    const tagOptions = tags.map((tag) => ({
        value: tag.name,
        label: tag.name,
    }));

    const handlePost = () => {};

    return createPortal(
        <div>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/70"
                        onClick={onClose}
                    ></div>
                    <PostForm
                        handlePost={handlePost}
                        onClose={onClose}
                        categories={categoryOptions}
                        tags={tagOptions}
                    />
                </>
            )}
        </div>,
        modalRoot,
    );
}
