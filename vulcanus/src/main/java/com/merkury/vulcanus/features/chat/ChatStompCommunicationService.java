package com.merkury.vulcanus.features.chat;

import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.entities.chat.ChatParticipant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatStompCommunicationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastChatMessageToAllChatParticipants(List<ChatParticipant> chatParticipants, ChatMessageDto chatMessageDto) {
        log.info("Broadcasting chat message to {} participants: {}", (long) chatParticipants.size(), chatMessageDto);
        chatParticipants.forEach(participant -> messagingTemplate.convertAndSend("/subscribe/chats" + participant.getUser().getUsername(), chatMessageDto));
    }

}
