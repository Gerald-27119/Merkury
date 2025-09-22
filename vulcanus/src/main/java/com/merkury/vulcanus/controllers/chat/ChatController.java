package com.merkury.vulcanus.controllers.chat;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.features.chat.ChatService;
import com.merkury.vulcanus.model.dtos.chat.ChatDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDtoSlice;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    // TODO: przy edycji chatu sprawdzenie czy user ma odmina an tym czacie

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<ChatMessageDtoSlice> getMessagesForChatByChatId(
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "1") int pageParam, // 1 because first page of 20 is returned in first request to "/user-chats"
            @RequestParam(defaultValue = "20") int numberOfMessagesPerPage
    ) {
        return ResponseEntity.ok(chatService.getChatMessages(chatId, pageParam, numberOfMessagesPerPage));
    }

    @GetMapping("/user-chats")
    public ResponseEntity<List<ChatDto>> getChatsForUserWithLast20Messages(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int numberOfChatsPerPage
    ) {
        return ResponseEntity.ok(chatService.getChatsForUserWithLast20Messages(pageNumber, numberOfChatsPerPage));
    }

    @PostMapping("/get-or-create-private-chat")
    public ResponseEntity<ChatDto> getOrCreatePrivateChat(
            @RequestParam String receiverUsername,
            @RequestParam(required = false) Long chatId
    ) throws UserNotFoundException {
        return ResponseEntity.ok(chatService.getOrCreatePrivateChat(chatId, receiverUsername));
    }

}
