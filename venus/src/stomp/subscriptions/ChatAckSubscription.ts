import { IMessage } from "@stomp/stompjs";
import { QueryClient, InfiniteData } from "@tanstack/react-query";
import { chatActions } from "../../redux/chats";
import { ChatMessageDto } from "../../model/interface/chat/chatInterfaces";
import { AppDispatch } from "../../redux/store";

type MessagesSlice = {
    messages: (ChatMessageDto & {
        optimistic?: boolean;
        optimisticUUID?: string;
    })[];
    hasNextSlice: boolean;
    sliceNumber: number;
};

export function createAckSubscription(
    username: string,
    dispatch: AppDispatch,
    queryClient: QueryClient,
) {
    return {
        destination: `/subscribe/chats/ack/${username}`, // backendowe ACK
        callback: (msg: IMessage) => {
            const { chatMessageDto, optimisticMessageUUID } = JSON.parse(
                msg.body,
            ) as {
                chatMessageDto: ChatMessageDto;
                optimisticMessageUUID: string;
            };

            // 1) podmień optymistę po optimisticUUID (idempotentnie)
            queryClient.setQueryData<InfiniteData<MessagesSlice>>(
                ["messages", chatMessageDto.chatId],
                (old) => {
                    if (!old) return old;

                    const alreadyHasReal = old.pages.some((p) =>
                        (p.messages ?? []).some(
                            (m) => m.id === chatMessageDto.id,
                        ),
                    );

                    const pages = old.pages.map((p) => {
                        const nextMsgs = (p.messages ?? [])
                            .map((m) => {
                                if (
                                    m.optimisticUUID &&
                                    m.optimisticUUID === optimisticMessageUUID
                                ) {
                                    return chatMessageDto as any; // podmiana temp -> real
                                }
                                return m;
                            })
                            // jeśli real już jest, usuń ewentualnego optymistę po UUID
                            .filter(
                                (m) =>
                                    !(
                                        alreadyHasReal &&
                                        (m as any).optimisticUUID ===
                                            optimisticMessageUUID
                                    ),
                            );

                        return { ...p, messages: nextMsgs };
                    });

                    return { ...old, pages };
                },
            );

            // 2) lastMessage na liście czatów
            dispatch(
                chatActions.setLastMessage({
                    chatId: chatMessageDto.chatId,
                    message: chatMessageDto,
                }),
            );
        },
    };
}
