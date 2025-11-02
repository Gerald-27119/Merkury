import { createPortal } from "react-dom";
import ForumCategoryDto from "../../../model/interface/forum/forumCategoryDto";
import PostForm from "../posts/components/PostForm";
import PostDto from "../../../model/interface/forum/post/postDto";
import { addPost, editPost } from "../../../http/posts";
import TagDto from "../../../model/interface/tagDto";
import { useAppMutation } from "../../../hooks/useAppMutation";
import PostToEdit from "../../../model/interface/forum/post/postToEdit";
import { useQueryClient } from "@tanstack/react-query";

interface ForumAddPostModalProps {
    onClose: () => void;
    isOpen: boolean;
    mode: "create" | "edit";
    categories: ForumCategoryDto[];
    tags: TagDto[];
    postToEdit?: PostToEdit | null;
}

export default function ForumAddPostModal({
    onClose,
    isOpen,
    mode,
    categories,
    tags,
    postToEdit,
}: ForumAddPostModalProps) {
    const modalRoot = document.getElementById("modal");
    const queryClient = useQueryClient();

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

    const { mutateAsync: addPostMutate } = useAppMutation(addPost, {
        successMessage: "Post added successfully!",
        loginToAccessMessage: "Login to add posts",
        invalidateKeys: [["posts"]],
    });

    const { mutateAsync: editPostMutate } = useAppMutation(editPost, {
        successMessage: "Post updated successfully!",
        loginToAccessMessage: "Login to edit posts",
    });

    const handlePost = async (postData: PostDto) => {
        if (mode === "create") {
            await addPostMutate(postData);
        } else if (mode === "edit" && postToEdit?.id) {
            await editPostMutate(
                { postId: postToEdit.id, postData },
                {
                    onSuccess: async () => {
                        await queryClient.invalidateQueries({
                            queryKey: ["post", postToEdit.id],
                        });
                        await queryClient.invalidateQueries({
                            queryKey: ["posts"],
                        });
                    },
                },
            );
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
                    <PostForm
                        handlePost={handlePost}
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
