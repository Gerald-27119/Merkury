package com.merkury.vulcanus.controllers.chat;

import com.merkury.vulcanus.features.chat.ChatService;
import com.merkury.vulcanus.features.chat.ChatStompCommunicationService;
import com.merkury.vulcanus.model.dtos.chat.IncomingChatMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatStompCommunicationController {

    private final ChatStompCommunicationService chatStompCommunicationService;
    private final ChatService chatService;

    /**
     * Endpoint, który odbiera wiadomości dla konkretnego chatu.
     * Przykład: /app/send/123/message (dla chatu o id = 123)
     */
    @MessageMapping("/send/{chatId}/message")
    public void sendChatMessage(@DestinationVariable String chatId, @Payload IncomingChatMessageDto message) {
        // 1. Dostaję wiadomość od użytkownika na ten endpoint
        log.info("Received message for chat: {}, message: {}", chatId, message);
//        TODO: check if user can send message to this chat
        // 2. Zapisuję wiadomość w DB
//        TODO:aktualnie w cahtDto jest pole id ale przychdozce rpzeciez nie maja id, zmien nazwe, usun pole
        var chatMessageDtoToBroadCast = chatService.saveChatMessage(message);
        // 3. Wysyłam wiadomość na customowe kanały, które tworze dynamicznie dla członków chatu, na który wiadomość dostałem
        chatStompCommunicationService.broadcastChatMessageToAllChatParticipants(chatMessageDtoToBroadCast);//TODO:tutaj niewysylanie do usera ktory jest andwca?

        chatStompCommunicationService.broadcastACKVersionToSender(chatMessageDtoToBroadCast, message.optimisticMessageUUID());

//        TODO:remove: messagingTemplate.convertAndSend("/subscribe/" + chatId + "/chat", convertedToDtoMessageFromDb);
//        TODO:user recieves a message for a chat that he hasn't yet scrolled to on forntned so he doesn't have yet details of that chat.
//         SO then frontend should do an autoamtic Get of that CHat
    }

// https://docs.spring.io/spring-security/reference/servlet/integrations/websocket.html
// https://docs.spring.io/spring-framework/reference/web/websocket/server.html


}

//TODO: USER SENDS MESSAGE FLOW:
// 1. User sends message to the server (* POST vs STOMP dilemma)
// 2. Validate if User can send message to this chat (TODO)
// 2.1 Validate message fields (TODO)
// 2.2 Validate message content length (TODO)
// 3. Save message to DB
// 4. Broadcast message to all subscribers (via STOMP)

//TODO: poownienie forntu i ponownienie abckendu
