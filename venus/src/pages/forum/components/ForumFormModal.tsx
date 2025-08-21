import { createPortal } from "react-dom";
import ForumCategoryDto from "../../../model/interface/forum/forumCategoryDto";
import PostForm from "../posts/components/PostForm";
import PostDto from "../../../model/interface/forum/post/postDto";
import { addPost } from "../../../http/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { notificationAction } from "../../../redux/notification";
import { AxiosError } from "axios";
import TagDto from "../../../model/interface/tagDto";

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
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

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

    const { mutateAsync: mutateNewPost } = useMutation({
        mutationFn: addPost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["posts"] });
            dispatch(
                notificationAction.setSuccess({
                    message: "Post created successfully!",
                }),
            );
        },
        onError: (e: AxiosError) => {
            if (e.status === 401) {
                dispatch(
                    notificationAction.setInfo({
                        message: "Login to create posts.",
                    }),
                );
            } else {
                dispatch(
                    notificationAction.setError(
                        "Failed to create post. Please try again later.",
                    ),
                );
            }
        },
    });

    const handlePost = async (forumPostData: PostDto) => {
        console.log(forumPostData);
        await mutateNewPost(forumPostData);
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
                    />
                </>
            )}
        </div>,
        modalRoot,
    );
}
