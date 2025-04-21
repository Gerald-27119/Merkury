package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageSenderDto;
import com.merkury.vulcanus.model.dtos.chat.SimpleChatDto;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;

public class ChatMapper {

    public static ChatMessageDto toChatMessageDto(ChatMessage chatMessage) {
        var chatMessageSenderDto = ChatMessageSenderDto.builder()
                .id(chatMessage.getSender().getId())
                .name(chatMessage.getSender().getUsername())
                .profileImg(chatMessage.getSender().getProfileImage())
                .build();

        return ChatMessageDto.builder()
                .id(chatMessage.getId())
                .chatMessageSenderDto(chatMessageSenderDto)
                .sentAt(chatMessage.getSentAt())
                .content(chatMessage.getContent())
                .build();
    }

    public static SimpleChatDto toSimpleChatDto(Chat chat) {
//        var lastMessageEntity = chat.getMessages()); TODO: how to do it? repo method? or that way? i don t remember xdd
//        var lastMessageDto = LastMessageDto.builder()
//                .id(chat.getMessages().stream().findFirst())
//                .content(chat.getLastMessage().getContent())
//                .sentAt(chat.getLastMessage().getSentAt())
//                .senderName(chat.getLastMessage().getSender().getUsername())
//                .build();
        return null;
    }
}
