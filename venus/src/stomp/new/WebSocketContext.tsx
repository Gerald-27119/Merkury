import React, { createContext, useContext, useEffect } from "react";
import { SubscriptionDef } from "./useWebSocket";
import { chatSubscription } from "./subscriptions/ChatSubscription";
import { WebSocketService } from "./WebSocketService";

const WS_URL = process.env.REACT_APP_WS_URL || "http://localhost:8080/ws";
/** Singleton serwisu zarządzającego połączeniem */
const wsService = new WebSocketService(WS_URL);

const WebSocketContext = createContext<WebSocketService>(wsService);

/**
 * Provider opakowujący całą aplikację:
 * - connect() przy mount
 * - disconnect() przy unmount
 * - automatyczne założenie globalnych subskrypcji
 */
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // 1) Uruchom połączenie raz
    useEffect(() => {
        wsService.connect();
        return () => void wsService.disconnect();
    }, []);

    // 2) Załóż wszystkie globalne subskrypcje
    useEffect(() => {
        /**
         * Add more global subscriptions here.
         */
        const allSubs: SubscriptionDef[] = [chatSubscription];
        const cleanups = allSubs.map((sub) => {
            wsService.subscribe(sub.destination, sub.callback);
            return () => wsService.unsubscribe(sub.destination);
        });
        return () => cleanups.forEach((fn) => fn());
    }, []);

    return (
        <WebSocketContext.Provider value={wsService}>
            {children}
        </WebSocketContext.Provider>
    );
};

/** Hook zwracający instancję WebSocketService */
export const useWebSocketService = (): WebSocketService =>
    useContext(WebSocketContext);
