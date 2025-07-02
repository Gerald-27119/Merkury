package com.merkury.vulcanus.controllers.chat;

import com.merkury.vulcanus.features.chat.ChatService;
import com.merkury.vulcanus.features.chat.ChatStompCommunicationService;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatStompCommunicationController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatStompCommunicationService chatStompCommunicationService;
    private final ChatService chatService;

    /**
     * Endpoint, który odbiera wiadomości dla konkretnego chatu.
     * Przykład: /app/send/123/message (dla chatu o id = 123)
     */
    @MessageMapping("/send/{chatId}/message")
    public void sendMessage(@DestinationVariable String chatId, @Payload ChatMessageDto message) {
        log.info("Received message for chat: {}, message: {}", chatId, message);

        var convertedToDtoMessageFromDb = chatService.saveChatMessage(message);

        messagingTemplate.convertAndSend("/subscribe/" + chatId + "/chat", convertedToDtoMessageFromDb);
    }
}

// USER SENDS MESSAGE FLOW:
// 1. User sends message to the server (* POST vs STOMP dilemma)
// 2. Validate if User can send message to this chat (TODO)
// 2.1 Validate message fields (TODO)
// 2.2 Validate message content length (TODO)
// 3. Save message to DB
// 4. Broadcast message to all subscribers (via STOMP)

//Decided to sent messages also via stomp, not POST