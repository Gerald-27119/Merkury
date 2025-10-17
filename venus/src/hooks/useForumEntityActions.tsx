import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDispatchTyped from "./useDispatchTyped";
import { useNavigate } from "react-router-dom";
import { notificationAction } from "../redux/notification";
import capitalize from "antd/es/_util/capitalize";

interface useForumEntityActionsProps {
    entityName: string;
    queryKeys: {
        list: string;
        single: string;
    };
    redirectOnDelete: boolean;
    addFn?: (id: number) => Promise<any>;
    editFn?: (id: number) => Promise<any>;
    deleteFn: (id: number) => Promise<any>;
    voteFn: ({
        id,
        isUpvote,
    }: {
        id: number;
        isUpvote: boolean;
    }) => Promise<any>;
}

export default function useForumEntityActions({
    entityName,
    queryKeys,
    redirectOnDelete,
    addFn,
    editFn,
    deleteFn,
    voteFn,
}: useForumEntityActionsProps) {
    const isLogged = useSelector((state: RootState) => state.account.isLogged);
    const queryClient = useQueryClient();
    const dispatch = useDispatchTyped();
    const navigate = useNavigate();

    const { mutateAsync: mutateDelete } = useMutation({
        mutationFn: deleteFn,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [queryKeys.list] });
            dispatch(
                notificationAction.addSuccess({
                    message: `${capitalize(entityName)} deleted successfully!`,
                }),
            );
            if (redirectOnDelete) {
                navigate(`/forum`);
            }
        },
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message: `Failed to delete ${entityName}. Please try again later.`,
                }),
            );
        },
    });

    const { mutateAsync: mutateVote } = useMutation({
        mutationFn: voteFn,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [queryKeys.list],
            });
        },
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message: "Something went wrong. Please try again later.",
                }),
            );
        },
    });

    const handleAdd = async () => {};

    const handleEdit = async () => {};

    const handleDelete = async (id: number) => {
        await mutateDelete(id);
    };

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

    const handleShare = async (url: string) => {};

    const handleReply = async (id: number) => {};

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
