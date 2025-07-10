// import { Client } from "@stomp/stompjs";
//
// export const createStompClient = (brokerURL: string): Client => {
//     return new Client({
//         brokerURL, // WebSocket URL for STOMP connection, e.g., ws://localhost:8080/connect
//         reconnectDelay: 5000, // Auto-reconnect after 5 seconds if connection is lost
//         debug: (msg: string) => console.log(msg),
//     });
// };
// // TODO:zrob to tak aby dal calej apki bylo polaczenie na dzien dobry i tyko konkrety z hoockiem ustStomp?
//
// // TODO: delete
// export interface WebSocketChatMessage {
//     chatId: number;
//     sender: {
//         id: number;
//         name: string;
//         imgUrl?: string;
//     };
//     content: string;
//     sentAt: string;
// }
