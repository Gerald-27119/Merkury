import { SubscriptionDef } from "../useWebSocket";
import { IMessage } from "@stomp/stompjs";
import { chatActions } from "../../../redux/chats";
import store from "../../../redux/store";

export const chatSubscription: SubscriptionDef = {
    destination: "/topic/messages",
    callback: (msg: IMessage) => {
        const data = JSON.parse(msg.body);

        store.dispatch(chatActions.addMessage(data));
    },
};
