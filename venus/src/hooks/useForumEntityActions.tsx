import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDispatchTyped from "./useDispatchTyped";
import { useNavigate } from "react-router-dom";
import { notificationAction } from "../redux/notification";
import capitalize from "antd/es/_util/capitalize";
import { AxiosError } from "axios";

interface useForumEntityActionsProps<TAddPayload, TEditPayload> {
    entityName: string;
    queryKeys: {
        list: string;
        single: string;
    };
    redirectOnDelete?: boolean;
    addFn?: (payload: TAddPayload) => Promise<any>;
    editFn?: (payload: TEditPayload) => Promise<any>;
    deleteFn?: (id: number) => Promise<any>;
    voteFn?: ({
        id,
        isUpvote,
    }: {
        id: number;
        isUpvote: boolean;
    }) => Promise<any>;
}

export default function useForumEntityActions<
    TAddPayload = void,
    TEditPayload = void,
>({
    entityName,
    queryKeys,
    redirectOnDelete,
    addFn,
    editFn,
    deleteFn,
    voteFn,
}: useForumEntityActionsProps<TAddPayload, TEditPayload>) {
    const isLogged = useSelector((state: RootState) => state.account.isLogged);
    const queryClient = useQueryClient();
    const dispatch = useDispatchTyped();
    const navigate = useNavigate();

    const { mutateAsync: mutateAdd } = useMutation({
        mutationFn: addFn,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [queryKeys.list],
            });
            dispatch(
                notificationAction.addSuccess({
                    message: `${capitalize(entityName)} created successfully!`,
                }),
            );
        },
        onError: (e: AxiosError) => {
            if (e.status === 401) {
                dispatch(
                    notificationAction.addInfo({
                        message: `Login to add ${capitalize(entityName)}s.`,
                    }),
                );
            } else {
                dispatch(
                    notificationAction.addError({
                        message: `Failed to create ${entityName}. Please try again later.`,
                    }),
                );
            }
        },
    });

    const { mutateAsync: mutateEdit } = useMutation({
        mutationFn: editFn,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [queryKeys.list],
            });
            dispatch(
                notificationAction.addSuccess({
                    message: `${capitalize(entityName)} edited successfully!`,
                }),
            );
        },
        onError: (e: AxiosError) => {
            if (e.status === 401) {
                dispatch(
                    notificationAction.addInfo({
                        message: `Login to edit ${capitalize(entityName)}s.`,
                    }),
                );
            } else {
                dispatch(
                    notificationAction.addError({
                        message: `Failed to edit ${entityName}. Please try again later.`,
                    }),
                );
            }
        },
    });

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
        onError: (e: AxiosError) => {
            if (e.status == 401) {
                dispatch(
                    notificationAction.addInfo({
                        message: "Login to vote",
                    }),
                );
            } else {
                dispatch(
                    notificationAction.addError({
                        message:
                            "Something went wrong. Please try again later.",
                    }),
                );
            }
        },
    });

    const handleAdd = async (payload: TAddPayload) => {
        await mutateAdd(payload);
    };

    const handleEdit = async (payload: TEditPayload) => {
        await mutateEdit(payload);
    };

    const handleDelete = async (id: number) => {
        await mutateDelete(id);
    };

    const handleVote = async (id: number, isUpvote: boolean) => {
        await mutateVote({ id, isUpvote });
    };

    const handleReport = async (id: number) => {};

    const handleFollow = async (id: number) => {};

    const handleShare = async (url: string) => {};

    const handleReply = async (id: number) => {};

    return {
        handleAdd,
        handleEdit,
        handleDelete,
        handleVote,
        handleFollow,
        handleReport,
        handleShare,
        handleReply,
    };
}
