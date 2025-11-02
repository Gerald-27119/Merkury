import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notificationAction } from "../redux/notification";
import useDispatchTyped from "./useDispatchTyped";

interface useAppMutationProps {
    successMessage?: string;
    loginToAccessMessage?: string;
    invalidateKeys?: (string | number | undefined)[][];
    errorMessages?: Record<number, string>;
}

export function useAppMutation<TData, TVariables>(
    mutationFn: (vars: TVariables) => Promise<TData>,
    {
        successMessage,
        loginToAccessMessage,
        invalidateKeys = [],
        errorMessages,
    }: useAppMutationProps = {},
) {
    const queryClient = useQueryClient();
    const dispatch = useDispatchTyped();

    return useMutation({
        mutationFn,
        onSuccess: async () => {
            if (invalidateKeys.length > 0) {
                await Promise.all(
                    invalidateKeys.map((key) =>
                        queryClient.invalidateQueries({ queryKey: key }),
                    ),
                );
            }

            if (successMessage) {
                dispatch(
                    notificationAction.addSuccess({
                        message: successMessage,
                    }),
                );
            }
        },
        onError: (error: AxiosError) => {
            const status = error.response?.status;

            if (status === 401 && loginToAccessMessage) {
                dispatch(
                    notificationAction.addInfo({
                        message: loginToAccessMessage,
                    }),
                );
                return;
            }

            if (status && errorMessages?.[status]) {
                dispatch(
                    notificationAction.addError({
                        message: errorMessages[status],
                    }),
                );
                return;
            }

            // fallback
            dispatch(
                notificationAction.addError({
                    message: "Something went wrong. Please try again later.",
                }),
            );
        },
    });
}
