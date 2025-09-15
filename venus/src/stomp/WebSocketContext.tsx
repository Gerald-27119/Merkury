import React, { createContext, useContext, useEffect, useRef } from "react";
import { SubscriptionDef } from "./useWebSocket";
import { createChatSubscription } from "./subscriptions/ChatSubscription";
import { WebSocketService } from "./WebSocketService";
import useDispatchTyped from "../hooks/useDispatchTyped";
import useSelectorTyped from "../hooks/useSelectorTyped";
import store, { RootState } from "../redux/store";

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

    const selectedRef = useRef<number | null>(null);
    useEffect(() => {
        selectedRef.current = selectedChatId;
    }, [selectedChatId]);

    useEffect(() => {
        if (isLogged) wsService.connect();
        else wsService.disconnect();
    }, [isLogged]);

    useEffect(() => {
        if (!isLogged || !username) return;

        const getSelectedChatId = () => store.getState().chats.selectedChatId;

        const allSubs: SubscriptionDef[] = [
            createChatSubscription(username, dispatch, getSelectedChatId),
        ];

        const cleanups = allSubs.map((sub) => {
            wsService.subscribe(sub.destination, sub.callback);
            return () => wsService.unsubscribe(sub.destination);
        });
        return () => cleanups.forEach((fn) => fn());
    }, [isLogged, username, dispatch]);

    return (
        <WebSocketContext.Provider value={wsService}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketService = (): WebSocketService =>
    useContext(WebSocketContext);
