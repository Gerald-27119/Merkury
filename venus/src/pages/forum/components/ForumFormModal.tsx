import { createPortal } from "react-dom";
import CategoryDto from "../../../model/interface/forum/categoryDto";
import TagDto from "../../../model/interface/forum/tagDto";
import PostForm from "../posts/components/PostForm";

interface ModalProps {
    onClose: () => void;
    isOpen: boolean;
    categories: CategoryDto[];
    tags: TagDto[];
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
