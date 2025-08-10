// stomp/subscriptions/ChatSubscription.ts
import { SubscriptionDef } from "../useWebSocket";
import { IMessage } from "@stomp/stompjs";
import { ChatMessageDto } from "../../model/interface/chat/chatInterfaces";
import { chatActions } from "../../redux/chats";
import type { AppDispatch } from "../../redux/store";

export function createChatSubscription(
    username: string,
    dispatch: AppDispatch,
    getSelectedChatId: () => number | null, // ⬅️ ważne!
): SubscriptionDef {
    return {
        destination: `/subscribe/chats/${username}`,
        callback: (msg: IMessage) => {
            const payload = JSON.parse(msg.body) as ChatMessageDto;

            // aktualizuj lastMessage
            dispatch(
                chatActions.setLastMessage({
                    chatId: payload.chatId,
                    message: payload,
                }),
            );

            // ustaw „has new” tylko jeśli ten czat nie jest aktualnie otwarty
            const selected = getSelectedChatId();
            if (selected !== payload.chatId) {
                dispatch(chatActions.markNew(payload.chatId));
            } else {
                dispatch(chatActions.clearNew(payload.chatId));
            }
        },
    };
}
