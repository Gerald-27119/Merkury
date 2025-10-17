import { createPortal } from "react-dom";
import ForumCategoryDto from "../../../model/interface/forum/forumCategoryDto";
import PostForm from "../posts/components/PostForm";
import PostDto from "../../../model/interface/forum/post/postDto";
import { addPost } from "../../../http/posts";
import TagDto from "../../../model/interface/tagDto";
import useForumEntityActions from "../../../hooks/useForumEntityActions";
import { ForumEntityPayloads } from "../../../model/interface/forum/forumEntityPayloads";

interface ModalProps {
    onClose: () => void;
    isOpen: boolean;
    categories: ForumCategoryDto[];
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

    const { handleAdd } = useForumEntityActions<ForumEntityPayloads["addPost"]>(
        {
            entityName: "post",
            addFn: addPost,
            queryKeys: { list: "posts", single: "post" },
        },
    );

    const handleAddPost = async (newPost: PostDto) => {
        await handleAdd(newPost);
    };

    return createPortal(
        <div>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/70"
                        onClick={onClose}
                    ></div>
                    <PostForm
                        handleAddPost={handleAddPost}
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
