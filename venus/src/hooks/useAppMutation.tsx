import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notificationAction } from "../redux/notification";
import useDispatchTyped from "./useDispatchTyped";

interface useAppMutationProps {
    successMessage?: string;
    loginToAccessMessage?: string;
    invalidateKeys?: (string | number | undefined)[][];
}

export function useAppMutation<TData, TVariables>(
    mutationFn: (vars: TVariables) => Promise<TData>,
    {
        successMessage,
        loginToAccessMessage,
        invalidateKeys = [],
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
            if (error.response?.status === 401 && loginToAccessMessage) {
                dispatch(
                    notificationAction.addInfo({
                        message: loginToAccessMessage,
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
}
