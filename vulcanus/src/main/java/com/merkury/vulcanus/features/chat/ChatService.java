package com.merkury.vulcanus.features.chat;

import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.DetailedChatDto;
import com.merkury.vulcanus.model.dtos.chat.SimpleChatDto;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import com.merkury.vulcanus.model.mappers.ChatMapper;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    public List<SimpleChatDto> getSimpleChatListForUserId(Long userId, int pageNumber, int numberOfChatsPerPage) {
        Pageable pg = PageRequest.of(
                pageNumber,
                numberOfChatsPerPage,
                Sort.by("lastMessageAt").descending()
        );

        Page<Chat> pageOfChats = chatRepository.findAllByParticipantsUserId(userId, pg);

        return pageOfChats.stream()
                .map(chat -> {
                    // assuming chat.getChatMessages() is @OrderBy("sentAt DESC"),
                    // otherwise compute:
                    ChatMessage lastMsg = chat.getChatMessages().stream()
                            .max(Comparator.comparing(ChatMessage::getSentAt))
                            .orElse(null);
                    return ChatMapper.toSimpleChatDto(chat, lastMsg, userId);
                })
                .toList();
    }

    public DetailedChatDto getDetailedChatForUserId(Long userId, Long chatId) {
        Chat chat = chatRepository
                .findByIdAndParticipantsUserId(chatId, userId)//po co oba?
                .orElseThrow(() -> new EntityNotFoundException("Chat not found or access denied"));

        // first 15 messages (most recent first)
        Pageable firstPage = PageRequest.of(0, 15, Sort.by("sentAt").descending());
        List<ChatMessage> messages = chatMessageRepository
                .findAllByChatId(chatId, firstPage)
                .getContent();

        return ChatMapper.toDetailedChatDto(chat, messages);
    }

    public List<ChatMessageDto> getChatMessages(Long chatId, int pageNumber, int numberOfMessagesPerPage) {
        Pageable pg = PageRequest.of(pageNumber,
                numberOfMessagesPerPage,
                Sort.by("sentAt").descending());

        return chatMessageRepository.findAllByChatId(chatId, pg).stream().map(message -> {
            var mappedSender = ChatMapper.toChatMessageSenderDto(message);
            return ChatMapper.toChatMessageDto(message, mappedSender);
        }).toList();
    }
}
