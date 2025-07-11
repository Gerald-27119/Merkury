import React, { createContext, useContext, useEffect } from "react";
import { SubscriptionDef } from "./useWebSocket";
import { createChatSubscription } from "./subscriptions/ChatSubscription";
import { WebSocketService } from "./WebSocketService";
import { RootState } from "../redux/store";
import useSelectorTyped from "../hooks/useSelectorTyped";
import useDispatchTyped from "../hooks/useDispatchTyped";

const WS_URL = process.env.REACT_APP_WS_URL || "http://localhost:8080/connect";
/** Singleton serwisu zarządzającego połączeniem */
const wsService = new WebSocketService(WS_URL);

const WebSocketContext = createContext<WebSocketService>(wsService);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isLogged, username } = useSelectorTyped(
        (state: RootState) => state.account,
    );
    const dispatch = useDispatchTyped();

    useEffect(() => {
        if (isLogged) {
            wsService.connect();
        } else {
            wsService.disconnect();
        }
    }, [isLogged]);

    // manage subscriptions
    useEffect(() => {
        if (!isLogged || !username) return;

        const allSubs: SubscriptionDef[] = [
            createChatSubscription(username, dispatch),
            //TODO: Place for other subscriptions here
        ];

        // subscribe now
        const cleanups = allSubs.map((sub) => {
            wsService.subscribe(sub.destination, sub.callback);
            return () => wsService.unsubscribe(sub.destination);
        });

        // on user/logout/change, unsubscribe
        return () => cleanups.forEach((fn) => fn());
    }, [isLogged, username]);

    return (
        <WebSocketContext.Provider value={wsService}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketService = (): WebSocketService =>
    useContext(WebSocketContext);
