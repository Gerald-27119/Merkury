package com.merkury.vulcanus.controllers.chat;

import com.merkury.vulcanus.features.chat.ChatService;
import com.merkury.vulcanus.model.dtos.chat.ChatDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.DetailedChatDto;
import com.merkury.vulcanus.model.dtos.chat.SimpleChatDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/public/chats")//TODO:make it private, verify if user has access to both chat and messages
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    //TODO:delete
    @GetMapping
    public ResponseEntity<List<SimpleChatDto>> getSimpleChatDtos(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int pageParam,
            @RequestParam(defaultValue = "13") int numberOfChatsPerPage
    ) {
        return ResponseEntity.ok(chatService.getSimpleChatListForUserId(userId, pageParam, numberOfChatsPerPage));
    }

    //TODO:delete
    @GetMapping("/{chatId}")
    public ResponseEntity<DetailedChatDto> getDetailedChatDtos(
            @PathVariable Long chatId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(chatService.getDetailedChatForUserId(userId, chatId));
    }


    //TODO: add javadoc
    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getMessagesForChatByChatId(
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "0") int pageParam,
            @RequestParam(defaultValue = "20") int numberOfMessagesPerPage
    ) {
        return ResponseEntity.ok(chatService.getChatMessages(chatId, pageParam, numberOfMessagesPerPage));
    }

    /**
     * Retrieves a <strong> PAGINATED </strong> list of recent chats for a specific user.
     * <p>
     * It's the most important endpoint for retrieving necessary data for the <strong>chat module</strong> on frontend.
     * <p>
     * Chats are ordered by the timestamp of the last message in each chat,
     * with the most recent appearing first. Each {@link ChatDto} includes
     * all necessary data to render the chat both in a list and in the detailed
     * messages view.
     *
     * @param pageNumber            zero-based page index (starting at 0)
     * @param numberOfChatsPerPage the maximum number of chats to return per page
     * @return a paginated {@code List<ChatDto>} sorted by last message date (descending)
     * @author Adam Langmesser
     * @see ChatDto
     */
    @GetMapping("/user-chats")
    public ResponseEntity<List<ChatDto>> getChatsForUser(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int numberOfChatsPerPage
    ) {
        return ResponseEntity.ok(chatService.getChatsWithLast20MessagesForUser(pageNumber, numberOfChatsPerPage));
    }

}
