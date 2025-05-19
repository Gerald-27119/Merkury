package com.merkury.vulcanus.controllers.chat;

import com.merkury.vulcanus.features.chat.ChatService;
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
@RequestMapping("/public/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /*
        * After consideration I decided to send bigger objects but in lesser quantity.
     */
    @GetMapping
    public ResponseEntity<List<SimpleChatDto>> getSimpleChatDtos(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int pageParam,
            @RequestParam(defaultValue = "13") int numberOfChatsPerPage
    ) {
        return ResponseEntity.ok(chatService.getSimpleChatListForUserId(userId, pageParam, numberOfChatsPerPage));
    }

//    TODO: delete
    @GetMapping("/{chatId}")
    public ResponseEntity<DetailedChatDto> getDetailedChatDtos(
            @PathVariable Long chatId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(chatService.getDetailedChatForUserId(userId, chatId));
    }


    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getMoreMessages(
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "0") int pageParam,
            @RequestParam(defaultValue = "20") int numberOfMessagesPerPage
    ) {
        return ResponseEntity.ok(chatService.getChatMessages(chatId, pageParam, numberOfMessagesPerPage));
    }
}
