import { useEffect, useState, useCallback } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { createStompClient } from "./stompClient";
import { useDispatch } from "react-redux";
import { chatActions } from "../redux/chats";
import { ChatMessageDto } from "../model/interface/chat/chatInterfaces";

export const useStomp = (brokerURL: string, chatId: number) => {
    const dispatch = useDispatch();
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // 1) połączenie
    useEffect(() => {
        const stompClient = createStompClient(brokerURL);
        stompClient.onConnect = () => setIsConnected(true);
        stompClient.activate();
        setClient(stompClient);
        return () => void stompClient.deactivate();
    }, [brokerURL]);

    // 2) subskrypcja i dispatch addMessage({ chatId, message })
    useEffect(() => {
        if (!client || !isConnected) return;

        const topic = `/subscribe/${chatId}/chat`;
        const sub: StompSubscription = client.subscribe(
            topic,
            (msg: IMessage) => {
                const payload = JSON.parse(msg.body) as ChatMessageDto;
                dispatch(chatActions.addMessage({ chatId, message: payload }));
            },
        );

        return () => sub.unsubscribe();
    }, [client, isConnected, chatId, dispatch]);

    // 3) sendMessage, przyjmuje destination i body
    const sendMessage = useCallback(
        (
            destination: string,
            body: string,
            headers: Record<string, any> = {},
        ) => {
            if (!client || !client.connected) return;
            client.publish({ destination, body, headers });
        },
        [client],
    );

    return { isConnected, sendMessage };
};
