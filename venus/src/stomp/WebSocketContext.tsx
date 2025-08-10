import React, { createContext, useContext, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SubscriptionDef } from "./useWebSocket";
import { createChatSubscription } from "./subscriptions/ChatSubscription";
import { WebSocketService } from "./WebSocketService";
import useDispatchTyped from "../hooks/useDispatchTyped";
import useSelectorTyped from "../hooks/useSelectorTyped";
import { RootState } from "../redux/store";
import { createAckSubscription } from "./subscriptions/ChatAckSubscription";

const WS_URL = process.env.REACT_APP_WS_URL || "http://localhost:8080/connect";
const wsService = new WebSocketService(WS_URL);
const WebSocketContext = createContext<WebSocketService>(wsService);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isLogged, username } = useSelectorTyped(
        (state: RootState) => state.account,
    );
    const selectedChatId = useSelectorTyped((s) => s.chats.selectedChatId);
    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    // żywy getter na selectedChatId (bez importu store)
    const selectedRef = useRef<number | null>(null);
    useEffect(() => {
        selectedRef.current = selectedChatId;
    }, [selectedChatId]);

    useEffect(() => {
        if (isLogged) wsService.connect();
        else wsService.disconnect();
    }, [isLogged]);

    // manage subscriptions
    useEffect(() => {
        if (!isLogged || !username) return;

        const allSubs: SubscriptionDef[] = [
            createChatSubscription(
                username,
                dispatch,
                () => selectedRef.current,
            ),
            createAckSubscription(username, dispatch, queryClient), // ⬅️ NOWE
            // tutaj dokładamy kolejne suby
        ];

        const cleanups = allSubs.map((sub) => {
            wsService.subscribe(sub.destination, sub.callback);
            return () => wsService.unsubscribe(sub.destination);
        });

        return () => cleanups.forEach((fn) => fn());
    }, [isLogged, username, dispatch, queryClient]); // selectedChatId niepotrzebny – używamy refa

    return (
        <WebSocketContext.Provider value={wsService}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketService = (): WebSocketService =>
    useContext(WebSocketContext);
