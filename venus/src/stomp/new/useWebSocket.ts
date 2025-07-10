import { useEffect } from "react";
import { IMessage } from "@stomp/stompjs";
import { useWebSocketService } from "./WebSocketContext";

/**
 * Definicja jednej subskrypcji.
 */
export interface SubscriptionDef {
    /** Adres STOMP topicu, np. "/topic/chat/123" */
    destination: string;
    /** Callback na każdy otrzymany komunikat */
    callback: (msg: IMessage) => void;
}

/**
 * Opcje inicjalizacji hooka.
 * - subscriptions: tablica channelów do założenia od razu
 */
export interface UseWebSocketOptions {
    subscriptions?: SubscriptionDef[];
}

/**
 * Hook podobny do useGSAP:
 * - bierzesz opcjonalnie listę subskrypcji
 * - hook automatycznie je zakłada i czyści
 * - zwraca `publish()` do wysyłania
 *
 * @param options konfiguracja hooka
 */
export function useWebSocket(options: UseWebSocketOptions = {}) {
    const { subscriptions = [] } = options;
    const ws = useWebSocketService();

    // Lifecycle subskrypcji
    useEffect(() => {
        const cleanups = subscriptions.map(({ destination, callback }) => {
            ws.subscribe(destination, callback);
            // zwróć funkcję do unsubscription
            return () => ws.unsubscribe(destination);
        });
        return () => cleanups.forEach((fn) => fn());
        // każda zmiana `destination` powoduje teardown i re-sub
    }, [ws, ...subscriptions.map((s) => s.destination)]);

    /**
     * Wysyła wiadomość do brokera.
     */
    function publish(
        destination: string,
        payload: any,
        headers?: Record<string, string>,
    ) {
        ws.publish(destination, payload, headers);
    }

    /** Status połączenia */
    const connected = ws.connected;

    return { publish, connected };
}
