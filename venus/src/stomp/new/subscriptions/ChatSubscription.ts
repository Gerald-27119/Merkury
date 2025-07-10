import { SubscriptionDef } from "../useWebSocket";
import { IMessage } from "@stomp/stompjs";
import { chatActions } from "../../../redux/chats";
import store from "../../../redux/store";

export function createChatSubscription(username: string): SubscriptionDef {
    return {
        destination: `/subscribe/chats/${username}`,
        callback: (msg: IMessage) => {
            const data = JSON.parse(msg.body);
            console.log("Received chat message:", data);
            // store.dispatch(chatActions.addMessage(data));
        },
    };
}
