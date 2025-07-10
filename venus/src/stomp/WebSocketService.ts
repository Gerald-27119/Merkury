import { Client, IMessage, StompSubscription, Frame } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * Zarządza jednym połączeniem STOMP/WebSocket:
 * - inicjalizacja i automatyczne reconnect
 * - jednoczesne subskrypcje (wznowione po reconnect)
 * - publikacja wiadomości
 */
export class WebSocketService {
    private client: Client;
    private subscriptions = new Map<string, StompSubscription>();
    /** Przechowuje subskrypcje oczekujące na moment, kiedy połączenie WebSocket/STOMP stanie się aktywne. Prosty mechanizm buforowania*/
    private pendingSubs = new Map<string, (msg: IMessage) => void>();
    private isConnected = false;

    /**
     * @param brokerURL adres SockJS endpointu, np. "http://localhost:8080/ws"
     */
    constructor(private brokerURL: string) {
        this.client = new Client({
            webSocketFactory: () => new SockJS(this.brokerURL),
            reconnectDelay: 5000,
            debug: (msg: string) => console.debug("[STOMP]", msg),
            onStompError: this.onError.bind(this),
            onWebSocketClose: this.onClose.bind(this),
        });

        this.client.onConnect = this.onConnect.bind(this);
    }

    /**
     Jeśli połączenie jeszcze nie zostało nawiązane, to wywołanie connect() je utworzy.
     <p>
     Jeśli połączenie już istnieje (czyli metoda została już wcześniej wywołana i klient jest „aktywny”), to kolejne wywołanie connect() nie spowoduje błędu ani podwójnego połączenia — po prostu nic się nie zmieni.
     */
    connect(): void {
        if (!this.client.active) {
            this.client.activate();
        }
    }

    /** Rozłącza i czyści wszystkie subskrypcje. */
    disconnect(): void {
        this.client.deactivate();
        this.cleanupAll();
        this.isConnected = false;
    }

    /** @internal Gdy STOMP się połączy – wznowienie pendingSubs. */
    private onConnect(): void {
        this.isConnected = true;
        this.pendingSubs.forEach((cb, dest) => {
            const sub = this.client.subscribe(dest, cb);
            this.subscriptions.set(dest, sub);
        });
        this.pendingSubs.clear();
    }

    /** @internal Obsługa niespodziewanego zamknięcia socketu. */
    private onClose(evt: CloseEvent): void {
        console.warn("WebSocket closed:", evt.reason);
        this.isConnected = false;
        // stomp.js sam spróbuje reconnect
    }

    /** @internal Obsługa błędów STOMP frame z brokera. */
    private onError(frame: Frame): void {
        console.error("STOMP error:", frame.headers["message"], frame.body);
    }

    /**
     * Subskrybuje dany topic.
     * @param destination np. "/topic/chat"
     * @param callback wywoływany na każdy komunikat
     */
    subscribe(destination: string, callback: (msg: IMessage) => void): void {
        // odsubskrybuj poprzednią, jeśli była
        if (this.subscriptions.has(destination)) {
            this.subscriptions.get(destination)!.unsubscribe();
            this.subscriptions.delete(destination);
        }
        if (this.isConnected) {
            const sub = this.client.subscribe(destination, callback);
            this.subscriptions.set(destination, sub);
        } else {
            // zapisz do wznowienia po connect
            this.pendingSubs.set(destination, callback);
        }
    }

    /**
     * Usuwa subskrypcję z danego topicu.
     * @param destination identyfikator subskrypcji
     */
    unsubscribe(destination: string): void {
        if (this.subscriptions.has(destination)) {
            this.subscriptions.get(destination)!.unsubscribe();
            this.subscriptions.delete(destination);
        }
        this.pendingSubs.delete(destination);
    }

    /**
     * Publikuje wiadomość JSON-ując payload.
     * @param destination np. "/app/chat.send"
     * @param payload dowolny obiekt
     * @param headers dodatkowe nagłówki STOMP
     */
    publish(
        destination: string,
        payload: any,
        headers: Record<string, string> = {},
    ): void {
        if (!this.isConnected) {
            console.warn(
                `STOMP not connected, cannot publish to ${destination}`,
            );
            return;
        }
        this.client.publish({
            destination,
            body: JSON.stringify(payload),
            headers,
        });
    }

    /** Czy klient jest aktualnie połączony? */
    get connected(): boolean {
        return this.isConnected;
    }

    /** @internal Pełne sprzątanie przy disconnect. */
    private cleanupAll() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions.clear();
        this.pendingSubs.clear();
    }
}
