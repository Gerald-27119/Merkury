import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../http/posts";
import { notificationAction } from "../redux/notification";
import useDispatchTyped from "./useDispatchTyped";

export default function usePostActions() {
    const queryClient = useQueryClient();
    const dispatch = useDispatchTyped();

    const { mutateAsync: mutateDelete } = useMutation({
        mutationFn: deletePost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["posts"] });
            dispatch(
                notificationAction.setSuccess({
                    message: "Post deleted successfully!",
                }),
            );
        },
        onError: () => {
            dispatch(
                notificationAction.setError({
                    message: "Failed to delete post. Please try again later.",
                }),
            );
        },
    });

    const handleDelete = async (postId: number) => {
        await mutateDelete(postId);
    };

    const handleEdit = async (postId: number) => {};

    const handleFollow = async (postId: number) => {};

    const handleReport = async (postId: number) => {};

    return {
        handleDelete,
        handleEdit,
        handleFollow,
        handleReport,
    };
}
