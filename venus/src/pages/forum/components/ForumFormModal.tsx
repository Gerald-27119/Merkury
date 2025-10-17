import { createPortal } from "react-dom";
import ForumCategoryDto from "../../../model/interface/forum/forumCategoryDto";
import PostForm from "../posts/components/PostForm";
import PostDto from "../../../model/interface/forum/post/postDto";
import { addPost, editPost } from "../../../http/posts";
import TagDto from "../../../model/interface/tagDto";
import useForumEntityActions from "../../../hooks/useForumEntityActions";
import { ForumEntityPayloads } from "../../../model/interface/forum/forumEntityPayloads";

interface ModalProps {
    onClose: () => void;
    isOpen: boolean;
    categories: ForumCategoryDto[];
    tags: TagDto[];
    postToEdit?: PostDto | null;
}

export default function ForumFormModal({
    onClose,
    isOpen,
    categories,
    tags,
    postToEdit,
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

    const { handleAdd, handleEdit } = useForumEntityActions<
        ForumEntityPayloads["addPost"],
        ForumEntityPayloads["editPost"]
    >({
        entityName: "post",
        addFn: addPost,
        editFn: editPost,
        queryKeys: { list: "posts", single: "post" },
    });

    const handleAddPost = async (newPost: PostDto) => {
        await handleAdd(newPost);
    };

    const handleEditPost = async (postData: PostDto) => {
        await handleEdit({ postId: 1, postData });
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
                        handleEditPost={handleEditPost}
                        onClose={onClose}
                        categories={categoryOptions}
                        tags={tagOptions}
                        postToEdit={postToEdit}
                    />
                </>
            )}
        </div>,
        modalRoot,
    );
}
