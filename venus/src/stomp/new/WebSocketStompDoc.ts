/**
 * @file WebSocketStompDoc.ts
 * @description
 * Warstwa subprotokółu STOMP na bazie transportu WebSocket/SockJS.
 *
 * STOMP (Simple Text Oriented Messaging Protocol) jest prostym, tekstowym
 * protokołem messagingowym zdefiniowanym na warstwie aplikacji. Nie jest
 * samodzielnym transportem sieciowym — do wysyłania ramek STOMP używa
 * standardowego kanału WebSocket lub jego emulacji (SockJS). Dzięki temu:
 * 1. STOMP definiuje format ramek (CONNECT, SEND, SUBSCRIBE, MESSAGE, ACK/NACK itd.),
 *    a WebSocket jedynie zapewnia dwukierunkowy kanał transmisji binarnej lub tekstowej.
 * 2. WebSocket jest warstwą transportową (nad TCP), nie określa zawartości wiadomości —
 *    treść można zdefiniować dowolnie (JSON, XML, własne ramki).
 * 3. STOMP jako subprotokół działa na każde środowisko, które obsługuje niezawodny strumień dwukierunkowy,
 *    w tym WebSocket, raw TCP czy nawet Telnet.
 *
 * @example
 * // konfiguracja STOMP.js na SockJS:
 * import { Client } from "@stomp/stompjs"; - Biblioteka STOMP.js
 * import SockJS      from "sockjs-client"; - Biblioteka SockJS
 *
 * const client = new Client({
 *   // SockJS emuluje WebSocket z fallbackiem XHR/JSONP
 *   webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
 *   reconnectDelay: 5000,
 * });
 *
 * client.onConnect = () => {
 *   // STOMP-owe ramki będą przepływać przez warstwę WebSocket
 *   client.subscribe("/topic/wiadomosci", msg => {
 *     console.log("Otrzymano:", msg.body);
 *   });
 *   client.publish({ destination: "/app/chat.send", body: "Cześć!" });
 * };
 *
 * client.activate();
 *
 * @remarks
 * - Użycie STOMP na WebSocket pozwala korzystać z gotowych brokerów (RabbitMQ, ActiveMQ, Spring broker),
 *   które rozumieją ramki STOMP i oferują funkcje pub/sub, transakcje czy potwierdzenia dostarczenia.
 */
