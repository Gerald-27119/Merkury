package com.merkury.vulcanus.features.chat;

import com.merkury.vulcanus.model.dtos.chat.ChatDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.DetailedChatDto;
import com.merkury.vulcanus.model.dtos.chat.SimpleChatDto;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import com.merkury.vulcanus.model.mappers.ChatMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    public List<SimpleChatDto> getSimpleChatListForUserId(Long userId, int pageNumber, int numberOfChatsPerPage) {
        Pageable pg = PageRequest.of(
                pageNumber,
                numberOfChatsPerPage,
                Sort.by("lastMessageAt").descending()
        );

        Page<Chat> pageOfChats = chatRepository.findAllByParticipantsUserId(userId, pg);
        //TODO:od razu zwracaj
        var chatList = pageOfChats.stream()
        .map(chat -> {
//            TODO:check if correct
//            List<ChatMessage> last20Messages = chatMessageRepository
//                    .findAllByChatId(chat.getId(), PageRequest.of(0, 20, Sort.by("sentAt").descending()))
//                    .getContent();

//            TODO: does this new repo method work???
            List<ChatMessage> last20Messages = chatMessageRepository
                    .findTop20ByChatIdOrderBySentAtDesc(chat.getId());

//            TODO:get rid off
            ChatMessage lastMsg = chat.getChatMessages().stream()
                    .max(Comparator.comparing(ChatMessage::getSentAt))//TODO:to vs pole lastMEssageSentAt na chat
                    .orElse(null);

            return ChatMapper.toSimpleChatDto(chat, lastMsg, userId, last20Messages);
        })
        .toList();

        return chatList;
    }

    public DetailedChatDto getDetailedChatForUserId(Long userId, Long chatId) {
        Chat chat = chatRepository
                .findByIdAndParticipantsUserId(chatId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found or access denied"));

        //TODO: decide on the number of messages to fetch
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

    //TODO:why it works here correctly?
    @Transactional
    public ChatMessageDto saveChatMessage(ChatMessageDto chatMessageDto) {

        var chat = chatRepository.findById(chatMessageDto.chatId())
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        var sender = userEntityRepository.findById(chatMessageDto.sender().id())
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        var chatMessage = ChatMessage.builder()
                .content(chatMessageDto.content())
                .sender(sender)
                .chat(chat)
                .build();

        chat.getChatMessages().add(chatMessage);
        chat.setLastMessageAt(LocalDateTime.now());//TODO; optimise it better


        chatMessageRepository.save(chatMessage);
        chatRepository.save(chat);//@OneToMany(mappedBy = "chat", cascade = CascadeType.PERSIST) - check more deeply
        var lastMessage = chat.getChatMessages().stream()
                .max(Comparator.comparing(ChatMessage::getSentAt))
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));
        //TODO:diffrent Mapper to add ID to the message
        //ALso use diffrent DTO with chat Id?
        //TODO:ktorys z tych save caht lubc hatMEssage nie jest zbedny?
        //TODO:how to update messages on front correclty?
        return ChatMapper.toChatMessageDto(chatMessage, chatMessageDto.sender());
    }

    public List<ChatDto> getChatsForUser(int pageParam, int numberOfChatsPerPage) {
        //czy msuze ttuaj robic get chats for user z tym messageSentAt decending cyz moge tryzamc message w bazie malejaco i odswierzac
        //tutaj skonczyles

        return null;
    }
}
