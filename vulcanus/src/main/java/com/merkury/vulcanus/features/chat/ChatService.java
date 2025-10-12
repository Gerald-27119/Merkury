package com.merkury.vulcanus.features.chat;

import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.ChatAlreadyExistsException;
import com.merkury.vulcanus.exception.exceptions.ChatNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.exception.exceptions.UserByUsernameNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.features.azure.AzureBlobService;
import com.merkury.vulcanus.model.dtos.chat.ChatDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDtoSlice;
import com.merkury.vulcanus.model.dtos.chat.IncomingChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.group.CreateGroupChatDto;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import com.merkury.vulcanus.model.entities.chat.ChatMessageAttachedFile;
import com.merkury.vulcanus.model.enums.AzureBlobFileValidatorType;
import com.merkury.vulcanus.model.enums.chat.ChatType;
import com.merkury.vulcanus.model.mappers.chat.ChatMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserEntityRepository userEntityRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final AzureBlobService azureBlobService;
    private final ChatStompCommunicationService chatStompCommunicationService;
    private final GroupChatService groupChatService;


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

    @Transactional
    public ChatDto getOrCreatePrivateChat(@Nullable Long chatId, String receiverUsername) throws UserNotFoundException {
        Optional<Chat> optionalChat = Optional.ofNullable(chatId).flatMap(chatRepository::findById);

        if (optionalChat.isPresent()) {
            return getChat(optionalChat.get());
        } else {
            try {
                return createPrivateChat(receiverUsername);
            } catch (ChatAlreadyExistsException e) {
                var currentUserUsername = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
                var chat = chatRepository.findPrivateBetween(currentUserUsername, receiverUsername).get();
                return getChat(chat);
            }
        }
    }

    private ChatDto getChat(Chat chat) throws UserNotFoundException {
        var currentUser = userEntityRepository.findByUsername(customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername())
                .orElseThrow(() -> new UserNotFoundException("Current user not found in db"))
                .getId();
        var last20Messages = chatMessageRepository
                .findTop20ByChatIdOrderBySentAtDesc(chat.getId());
        return ChatMapper.toChatDto(chat, last20Messages, currentUser);
    }

    private ChatDto createPrivateChat(String receiverUsername) throws ChatAlreadyExistsException, UserNotFoundException {
        var currentUserUsername = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        var optionalExistingPrivateChat = chatRepository.findPrivateBetween(currentUserUsername, receiverUsername);

        if (optionalExistingPrivateChat.isPresent()) {
            throw new ChatAlreadyExistsException(ChatType.PRIVATE, currentUserUsername, receiverUsername, optionalExistingPrivateChat.get().getId());
        }

        var currentUser = userEntityRepository.findByUsername(currentUserUsername)
                .orElseThrow(() -> new UserNotFoundException("Current user not found: " + currentUserUsername));

        var otherUser = userEntityRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + receiverUsername));

        var newChat = Chat.builder()
                .build();
        newChat.addParticipant(currentUser);
        newChat.addParticipant(otherUser);
        newChat = chatRepository.save(newChat);

        return ChatMapper.toChatDto(newChat, currentUser.getId());
    }

    /**
     * Returns a stable-order map of candidate usernames to the existing private chat ID
     * with the requesting user.
     *
     * <p>Keys are the provided candidate usernames (de-duplicated while preserving
     * their original encounter order). Values are the private chat IDs when such a chat
     * already exists, or {@code null} when it does not.</p>
     *
     * <p>Intended for UI scenarios like: social section in user's account/map/forum, allowing the client
     * to easily open existing chat with any encountered user or, in case of the chat not yet existing, client knows it has to request server to create it.</p>
     *
     * @param requesterUsername  the username of the currently authenticated user
     * @param candidateUsernames usernames to check against the requester
     * @return a {@link LinkedHashMap} mapping each candidate username to a chat ID or {@code null}
     */
    @Transactional
    public Map<String, Long> mapPrivateChatIdsByUsername(
            String requesterUsername,
            List<String> candidateUsernames
    ) {
        if (candidateUsernames == null || candidateUsernames.isEmpty()) return Map.of();

        Map<String, Long> chatIdsByUser = new LinkedHashMap<>();
        candidateUsernames.stream().distinct().forEach(candidateUsername -> chatIdsByUser.put(candidateUsername, null));

        chatRepository.findPrivateChatsWithOthers(requesterUsername, candidateUsernames)
                .forEach(row -> chatIdsByUser.put(row.getUsername(), row.getChatId()));
        return chatIdsByUser;
    }

    private Map<MultipartFile, String> sendFiles(@NotNull List<MultipartFile> mediaFiles) throws InvalidFileTypeException, BlobContainerNotFoundException, IOException {
        var mediaBlobUrlMap = new HashMap<MultipartFile, String>();

        for (MultipartFile file : mediaFiles) {
            String blobUrl = azureBlobService.upload("chat-message-files", file, AzureBlobFileValidatorType.CHAT);
            mediaBlobUrlMap.put(file, blobUrl);
        }

        return mediaBlobUrlMap;
    }

    public void organizeFilesSend(@NotNull List<MultipartFile> mediaFiles, Long chatId) throws InvalidFileTypeException, BlobContainerNotFoundException, IOException, ChatNotFoundException, UserByUsernameNotFoundException {
        Map<MultipartFile, String> mediaBlobUrlMap = this.sendFiles(mediaFiles);

        var chat = chatRepository.findById(chatId).orElseThrow(() -> new ChatNotFoundException(chatId));
        var senderUsername = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        var sender = userEntityRepository.findByUsername(senderUsername).orElseThrow(() -> new UserByUsernameNotFoundException(senderUsername));

        var chatMessage = ChatMessage.builder()
                .chat(chat)
                .sender(sender)
                .chatMessageAttachedFiles(new ArrayList<>())
                .build();

        List<ChatMessageAttachedFile> chatMessageAttachedFiles = mediaBlobUrlMap.entrySet().stream().map(entry -> {
            MultipartFile file = entry.getKey();
            String blobUrl = entry.getValue();

            return ChatMessageAttachedFile.builder()
                    .fileType(file.getContentType())
                    .sizeInBytes(file.getSize())
                    .name(file.getOriginalFilename())
                    .url(blobUrl)
                    .chatMessage(chatMessage)
                    .build();
        }).toList();

        chatMessage.getChatMessageAttachedFiles().addAll(chatMessageAttachedFiles);
        var chatMessageFromDb = chatMessageRepository.save(chatMessage);

        var chatMessageDtoToBroadCast = ChatMapper.toChatMessageDto(chatMessageFromDb);
        chatStompCommunicationService.broadcastChatMessageToAllChatParticipants(chatMessageDtoToBroadCast);
//        chatStompCommunicationService.broadcastACKVersionToSender(); TODO:fix
    }

    public ChatDto createGroupChat(CreateGroupChatDto createGroupChatDto) throws Exception {
        var ownerUsername = this.customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        var createdChat = this.groupChatService.create(new CreateGroupChatDto(createGroupChatDto.usernames(), ownerUsername));
        return ChatMapper.toChatDto(createdChat);
    }

    public ChatDto addUsersToGroupChat(List<String> usernames, String currentUserUsername, Long chatId) throws Exception {
        var currentUsername = this.customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        var updatedChat = this.groupChatService.addUsers(usernames, currentUsername, chatId);
        return ChatMapper.toChatDto(updatedChat);
    }
}
