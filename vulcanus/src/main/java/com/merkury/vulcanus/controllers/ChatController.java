package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.features.chat.ChatService;
import com.merkury.vulcanus.model.dtos.chat.DetailedChatDto;
import com.merkury.vulcanus.model.dtos.chat.SimpleChatDto;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import lombok.RequiredArgsConstructor;
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
    //get all
    //get detailed
    //create chat
    //send message ( i want by POST i guess, receiving new ones by WS, correcting with GET? )
//    TODO: tell in the book about the use of the websocket in the project
//    tell why relational db is worse for messaging

    private final ChatService chatService;

    /**
     * GET /api/chats?userId=42&page=0
     * returns up to 10 SimpleChatDto sorted by last interaction
     */
    @GetMapping
    public List<SimpleChatDto> listChats(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page
    ) {
        return chatService.getSimpleChatListForUserId(userId, page);
    }

    /**
     * GET /api/chats/{chatId}?userId=42
     * returns chat metadata + first 15 messages
     */
    @GetMapping("/{chatId}/{userId}")
    public DetailedChatDto getChatDetail(
            @PathVariable Long chatId,
            @PathVariable Long userId
    ) {
        return chatService.getDetailedChatForUserId(userId, chatId);
    }

    /**
     * GET /api/chats/{chatId}/messages?
     * userId=42&page=1
     * returns next 10 messages (page 1,2,…)
     */
    @GetMapping("/{chatId}/messages")
    public List<ChatMessage> getMoreMessages(
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "0") int page
    ) {
        return chatService.getChatMessages(chatId, page);
    }

}
