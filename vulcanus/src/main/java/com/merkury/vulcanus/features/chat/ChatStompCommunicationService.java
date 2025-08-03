package com.merkury.vulcanus.features.chat;

import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatStompCommunicationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRepository chatRepository;

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
     * @param chatMessageDto   the chat message to be broadcasted
     */
    @Transactional
    public void broadcastChatMessageToAllChatParticipants( ChatMessageDto chatMessageDto) {
        var chatParticipants = chatRepository.findById(chatMessageDto.chatId())
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"))
                .getParticipants();

        log.info("Broadcasting chat message to {} participants: {}", (long) chatParticipants.size(), chatMessageDto);
        chatParticipants.forEach(participant -> messagingTemplate.convertAndSend("/subscribe/chats/" + participant.getUser().getUsername(), chatMessageDto));
    }

//    TODO:robieni tego asynchronicznie? mechanizm ponowniea? jak to siema do powaidomien? ACK z forntu? ponownienie wyslania wiadomosci i ponownie broadcastu?, broadcast tylko do osob "online"?

}
