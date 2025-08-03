package com.merkury.vulcanus.features.chat;

import com.merkury.vulcanus.model.dtos.chat.ChatDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDtoSlice;
import com.merkury.vulcanus.model.dtos.chat.IncomingChatMessageDto;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import com.merkury.vulcanus.model.mappers.chat.ChatMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import com.merkury.vulcanus.security.services.ChatSecurityService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserEntityRepository userEntityRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final ChatSecurityService chatSecurityService;

    /**
     * Retrieves a <strong>PAGINATED</strong> list of recent chats with messages for a specific user.
     * <p>
     * <ol>
     *     <li>Retrieve from DB a {@code numberOfChatsPerPage} amount of chats that have the newest message.</li>
     *     <li>Retrieve last <strong>20 messages</strong> for each chat ordered by MessageSentAtDesc.</li>
     * </ol>
     *
     * @param pageNumber
     * @param numberOfChatsPerPage
     * @return {@code List<ChatDto>}
     * @author Adam Langmesser
     */
    public List<ChatDto> getChatsForUserWithLast20Messages(int pageNumber, int numberOfChatsPerPage) {
        var pageRequest = PageRequest.of(pageNumber, numberOfChatsPerPage,
                Sort.by("lastMessageAt").descending());

        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();

        //TODO:refactor mapper to use username instead of userId
        var userId = userEntityRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"))
                .getId();

        return chatRepository.findAllByParticipantsUserUsername(username, pageRequest)
                .stream()
                .map(chat -> {
                    var last20Messages = chatMessageRepository
                            .findTop20ByChatIdOrderBySentAtDesc(chat.getId());
                    return ChatMapper.toChatDto(chat, last20Messages, userId);
                })
                .toList();
    }

    @PreAuthorize("@chatSecurityService.isUserAChatMember(#chatId)")
    public ChatMessageDtoSlice getChatMessages(Long chatId, int pageNumber, int numberOfMessagesPerPage) {
        Pageable pg = PageRequest.of(pageNumber,
                numberOfMessagesPerPage,
                Sort.by("sentAt").descending());

        return ChatMapper.toChatMessageDtoSlice(chatMessageRepository.findAllByChatId(chatId, pg));
    }

    @Transactional
    public ChatMessageDto saveChatMessage(IncomingChatMessageDto chatMessageDto) {//TODO:check if user can send message to this chat
        var chat = chatRepository.findById(chatMessageDto.chatId())
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();

        var sender = userEntityRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        var chatMessage = ChatMessage.builder()
                .content(chatMessageDto.content())
                .sender(sender)
                .chat(chat)
                .build();

        chat.getChatMessages().add(chatMessage);
        chat.setLastMessageAt(LocalDateTime.now());//TODO; optimise it better


        var chatMessageFromDb = chatMessageRepository.save(chatMessage);
        chatRepository.save(chat);//@OneToMany(mappedBy = "chat", cascade = CascadeType.PERSIST) - check more deeply

//        TODO:WHY
        var lastMessage = chat.getChatMessages().stream()
                .max(Comparator.comparing(ChatMessage::getSentAt))
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        //TODO:use diffrent mapper and DTO for this
        return ChatMapper.toChatMessageDto(chatMessageFromDb, ChatMapper.toChatMessageSenderDto(chatMessageFromDb));

    }

}
