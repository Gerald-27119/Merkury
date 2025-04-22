package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageSenderDto;
import com.merkury.vulcanus.model.dtos.chat.DetailedChatDto;
import com.merkury.vulcanus.model.dtos.chat.SimpleChatDto;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;

import java.util.List;

public class ChatMapper {

    public static SimpleChatDto toSimpleChatDto(Chat chat, ChatMessage lastMessage) {
        var messageSenderDto = toChatMessageSenderDto(lastMessage);
        var lastMessageDto = ChatMapper.toChatMessageDto(lastMessage, messageSenderDto);

        return SimpleChatDto.builder()
                .id(chat.getId())
                .name(chat.getName())
                .lastMessageDto(lastMessageDto)
                .imgUrl(chat.getImgUrl())
                .build();
    }

    public static DetailedChatDto toDetailedChatDto(Chat chat, List<ChatMessage> chatMessageList) {
        var chatMessageDtoList = chatMessageList.stream()
                .map(chatMessage -> {
                    var messageSenderDto = toChatMessageSenderDto(chatMessage);
                    return ChatMapper.toChatMessageDto(chatMessage, messageSenderDto);
                })
                .toList();

        return DetailedChatDto.builder()
                .id(chat.getId())
                .name(chat.getName())
                .chatMessageDtoList(chatMessageDtoList)
                .imgUrl(chat.getImgUrl())
                .build();
    }

    private static ChatMessageDto toChatMessageDto(ChatMessage chatMessage,
                                                   ChatMessageSenderDto chatMessageSenderDto) {
        return ChatMessageDto.builder()
                .id(chatMessage.getId())
                .content(chatMessage.getContent())
                .sentAt(chatMessage.getSentAt())
                .chatMessageSenderDto(chatMessageSenderDto)
                .build();
    }

    private static ChatMessageSenderDto toChatMessageSenderDto(ChatMessage chatMessage) {
        return ChatMessageSenderDto.builder()
                .id(chatMessage.getSender().getId())
                .name(chatMessage.getSender().getUsername())
                .profileImg(chatMessage.getSender().getProfileImage())
                .build();
    }
}
