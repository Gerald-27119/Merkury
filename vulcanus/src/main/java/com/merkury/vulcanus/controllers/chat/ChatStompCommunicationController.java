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

    @MessageMapping("/send/{chatId}/message")
    public void sendChatMessage(@DestinationVariable String chatId, @Payload IncomingChatMessageDto message) {
        log.debug("Received message for chat: {}, message: {}", chatId, message);
        var chatMessageDtoToBroadCast = chatService.saveChatMessage(message);
        chatStompCommunicationService.broadcastChatMessageToAllChatParticipants(chatMessageDtoToBroadCast);
        chatStompCommunicationService.broadcastACKVersionToSender(chatMessageDtoToBroadCast, message.optimisticMessageUUID());
    }
}


