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

    /**
     * Broadcasts a chat message to all participants of the chat.
     *<p>
     * The STOMP endpoint for this method is dynamically created based on the username of each chat participant.
     * This allows each participant to receive messages sent to the chat they are part of.
     * <p>
     * Each User should listen on its own channel {@code /subscribe/chats{username}}.
     * <p>
     * Each User has one universal channel to receive new messages in real time for all chats they are part of.
     *
     * @param chatParticipants the list of chat participants to whom the message will be sent
     * @param chatMessageDto   the chat message to be broadcasted
     */
    public void broadcastChatMessageToAllChatParticipants(List<ChatParticipant> chatParticipants, ChatMessageDto chatMessageDto) {
        log.info("Broadcasting chat message to {} participants: {}", (long) chatParticipants.size(), chatMessageDto);
        chatParticipants.forEach(participant -> messagingTemplate.convertAndSend("/subscribe/chats" + participant.getUser().getUsername(), chatMessageDto));
    }

}
