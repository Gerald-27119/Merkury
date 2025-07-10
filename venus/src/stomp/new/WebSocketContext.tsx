import React, { createContext, useContext, useEffect } from "react";
import { SubscriptionDef } from "./useWebSocket";
import { chatSubscription } from "./subscriptions/ChatSubscription";
import { WebSocketService } from "./WebSocketService";
import { RootState } from "../../redux/store";
import useSelectorTyped from "../../hooks/useSelectorTyped";

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
    // 0) Stan zalogowania
    const isLogged = useSelectorTyped(
        (state: RootState) => state.account.isLogged,
    );

    // 1) Connect raz przy mount
    useEffect(() => {
        wsService.connect();
        return () => void wsService.disconnect();
    }, []);

    // 2) Globalne subskrypcje tylko gdy zalogowany
    useEffect(() => {
        if (!isLogged) {
            wsService.unsubscribe(chatSubscription.destination);
            return;
        }

        const allSubs: SubscriptionDef[] = [
            chatSubscription,
            // …tu inne globalne subskrypcje wymagające zalogowania
        ];
        const cleanups = allSubs.map((sub) => {
            wsService.subscribe(sub.destination, sub.callback);
            return () => wsService.unsubscribe(sub.destination);
        });
        return () => cleanups.forEach((fn) => fn());
    }, [isLogged]);

    return (
        <WebSocketContext.Provider value={wsService}>
            {children}
        </WebSocketContext.Provider>
    );
};

/** Hook zwracający instancję WebSocketService */
export const useWebSocketService = (): WebSocketService =>
    useContext(WebSocketContext);
