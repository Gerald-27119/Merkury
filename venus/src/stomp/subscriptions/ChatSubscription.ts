// subscriptions/ChatSubscription.ts
import { SubscriptionDef } from "../useWebSocket";
import { IMessage } from "@stomp/stompjs";
import { chatActions } from "../../redux/chats";
import { ChatMessageDto } from "../../model/interface/chat/chatInterfaces";
import type { AppDispatch } from "../../redux/store";

export function createChatSubscription(
    username: string,
    dispatch: AppDispatch,
    getSelectedChatId: () => number | null,
): SubscriptionDef {
    return {
        destination: `/subscribe/chats/${username}`,
        callback: (msg: IMessage) => {
            const payload = JSON.parse(msg.body) as ChatMessageDto;

            dispatch(
                chatActions.setLastMessage({
                    chatId: payload.chatId,
                    message: payload,
                }),
            );
            const selected = getSelectedChatId();
            if (selected !== payload.chatId) {
                dispatch(chatActions.incrementUnread(payload.chatId));
            }
        },
    };
}
