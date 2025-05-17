import { useEffect, useState, useCallback } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { createStompClient } from './stompClient';

export const useStomp = (brokerURL: string) => {
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const stompClient = createStompClient(brokerURL);
        stompClient.onConnect = () => {
            console.log('STOMP connected');
            setIsConnected(true);
        };
        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, [brokerURL]);

    const subscribe = useCallback(
        (
            destination: string,
        callback: (message: IMessage) => void,
        headers: Record<string, any> = {}
): StompSubscription | null => {
        if (!client || !client.connected) return null;
        return client.subscribe(destination, callback, headers);
    },
    [client]
);

    const sendMessage = useCallback(
        (destination: string, body: string, headers: Record<string, any> = {}) => {
            if (!client || !client.connected) return;
            client.publish({ destination, body, headers });
        },
        [client]
    );

    return { client, isConnected, subscribe, sendMessage };
};