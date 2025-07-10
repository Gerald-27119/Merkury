import React, { createContext, useContext, useEffect } from "react";
import { WebSocketService } from "./WebSocketService";

const WS_URL = process.env.REACT_APP_WS_URL || "http://localhost:8080/ws";
/** Singleton serwisu dla całej aplikacji */
const wsService = new WebSocketService(WS_URL);

const WebSocketContext = createContext<WebSocketService>(wsService);

/**
 * W App root:
 * - mount → connect()
 * - unmount → disconnect()
 */
export const WebSocketProvider: React.FC = ({ children }: any) => {
    useEffect(() => {
        wsService.connect();
        return () => void wsService.disconnect();
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
