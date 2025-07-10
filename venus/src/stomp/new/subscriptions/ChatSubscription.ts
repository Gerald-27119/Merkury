//gloabalna subskrypcja dla cahtow i logika z nia zwiazana np. wczuranie nowych wiadomosci do reduxa
// , porbanie detali chatu ejzeli user njezcze nie otworzyl czatu a dsotal wiadomosc do niego to trzba pobrac detale tecgo czatu

//subskrypcja w momencie zalogwoania na konto
// if(user is authenticaed)

// src/subscriptions/chatSubscription.ts

import { SubscriptionDef } from "../useWebSocket";
import { IMessage } from "@stomp/stompjs";
import { chatActions } from "../../../redux/chats";
import store from "../../../redux/store";

export const chatSubscription: SubscriptionDef = {
    destination: "/topic/messages",
    callback: (msg: IMessage) => {
        const data = JSON.parse(msg.body);
        // dispatchujemy do Redux
        store.dispatch(chatActions.addMessage(data));
    },
};
