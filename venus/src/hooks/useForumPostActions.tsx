import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deletePost, votePost } from "../http/posts";
import { notificationAction } from "../redux/notification";
import useDispatchTyped from "./useDispatchTyped";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function useForumPostActions({ redirectOnDelete = false } = {}) {
    const isLogged = useSelector((state: RootState) => state.account.isLogged);
    const queryClient = useQueryClient();
    const dispatch = useDispatchTyped();
    const navigate = useNavigate();

    const { mutateAsync: mutateDelete } = useMutation({
        mutationFn: deletePost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["posts"] });
            dispatch(
                notificationAction.addSuccess({
                    message: "Post deleted successfully!",
                }),
            );
            if (redirectOnDelete) {
                navigate(`/forum`);
            }
        },
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message: "Failed to delete post. Please try again later.",
                }),
            );
        },
    });

    const { mutateAsync: mutateVote } = useMutation({
        mutationFn: votePost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["post"] });
        },
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message: "Something went wrong. Please try again later.",
                }),
            );
        },
    });

    const handleDelete = async (postId: number) => {
        await mutateDelete(postId);
    };

    const handleEdit = async (postId: number) => {};

    const handleVote = async (id: number, isUpvote: boolean) => {
        if (isLogged) {
            await mutateVote({ id, isUpvote });
        } else {
            dispatch(
                notificationAction.addInfo({
                    message: "Login to vote.",
                }),
            );
        }
    };

    const handleFollow = async (id: number) => {};

    const handleReport = async (id: number) => {};

    const handleShare = async () => {};

    const handleReply = async () => {};

    return {
        handleDelete,
        handleEdit,
        handleVote,
        handleFollow,
        handleReport,
        handleShare,
        handleReply,
    };
}
