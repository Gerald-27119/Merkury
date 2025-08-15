import { SubscriptionDef } from "../useWebSocket";
import { IMessage } from "@stomp/stompjs";
import { chatActions } from "../../redux/chats";
import { ChatMessageDto } from "../../model/interface/chat/chatInterfaces";
import { AppDispatch } from "../../redux/store";

export function createChatSubscription(
    username: string,
    dispatch: AppDispatch,
): SubscriptionDef {
    return {
        destination: `/subscribe/chats/${username}`,
        callback: (msg: IMessage) => {
            const payload = JSON.parse(msg.body) as ChatMessageDto;
            dispatch(
                chatActions.addMessage({
                    chatId: payload.chatId,
                    message: payload,
                }),
            );
        },
    };
}
