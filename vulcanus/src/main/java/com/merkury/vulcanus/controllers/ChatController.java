package com.merkury.vulcanus.controllers;

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

    //TODO: parametrizacja ile na stronie
    /**
     * GET /public/chats?userId=42&page=0
     * returns up to 10 SimpleChatDto sorted by last interaction
     */
    @GetMapping
    public ResponseEntity<List<SimpleChatDto>> listChats(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page
    ) {
        List<SimpleChatDto> chats = chatService.getSimpleChatListForUserId(userId, page);
        return ResponseEntity.ok(chats);
    }

    /**
     * GET /public/chats/{chatId}/{userId}
     * returns chat metadata + first 15 messages
     */
    @GetMapping("/{chatId}/{userId}")
    public ResponseEntity<DetailedChatDto> getChatDetail(
            @PathVariable Long chatId,
            @PathVariable Long userId
    ) {
        DetailedChatDto dto = chatService.getDetailedChatForUserId(userId, chatId);
        return ResponseEntity.ok(dto);
    }

    /**
     * GET /public/chats/{chatId}/messages?page=1
     * returns next 10 messages (page 1, 2, …)
     */
    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getMoreMessages(
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "0") int page
    ) {
        List<ChatMessageDto> messages = chatService.getChatMessages(chatId, page);
        return ResponseEntity.ok(messages);
    }
}
//Each method now explicitly returns ResponseEntity<T>.
//
//You can later change, e.g.,
//
//java
//        Kopiuj
//Edytuj
//return chats.isEmpty()
//    ? ResponseEntity.noContent().build()
//    : ResponseEntity.ok(chats);
//if you want to send 204 No Content when there are no chats.
//
//        Similarly, you can catch a ChatNotFoundException in an @ControllerAdvice and return 404 Not Found for the detail endpoint.