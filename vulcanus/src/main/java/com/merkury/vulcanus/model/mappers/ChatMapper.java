package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageSenderDto;
import com.merkury.vulcanus.model.dtos.chat.DetailedChatDto;
import com.merkury.vulcanus.model.dtos.chat.SimpleChatDto;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class ChatMapper {

    public static SimpleChatDto toSimpleChatDto(Chat chat, ChatMessage lastMessage, Long userId) {
        var messageSenderDto = toChatMessageSenderDto(lastMessage);
        var lastMessageDto = ChatMapper.toChatMessageDto(lastMessage, messageSenderDto);

        return SimpleChatDto.builder()
                .id(chat.getId())
                .name(getChatName(chat, userId))
                .lastMessage(lastMessageDto)
                .imgUrl(getChatImgUrl(chat, userId))
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
                .messages(chatMessageDtoList)
                .imgUrl(chat.getImgUrl())
                .build();
    }

    public static ChatMessageDto toChatMessageDto(ChatMessage chatMessage,
                                                  ChatMessageSenderDto chatMessageSenderDto) {

        if (chatMessage == null) {
            return null;
        }
        return ChatMessageDto.builder()
                .id(chatMessage.getId())
                .content(chatMessage.getContent())
                .sentAt(chatMessage.getSentAt())
                .sender(chatMessageSenderDto)
                .build();
    }

    public static ChatMessageSenderDto toChatMessageSenderDto(ChatMessage chatMessage) {
        if (chatMessage == null) {
            return null;
        }

        return ChatMessageSenderDto.builder()
                .id(chatMessage.getSender().getId())
                .name(chatMessage.getSender().getUsername())
                .imgUrl(chatMessage.getSender().getProfileImage())
                .build();
    }

    private static String getChatName(Chat chat, Long userId) {
        if (chat.getName() != null) return chat.getName();
        else {
            switch (chat.getChatType()) {
                case PRIVATE -> {
                    return chat.getParticipants().stream()
                            .filter(chatParticipant -> !Objects.equals(chatParticipant.getUser().getId(), userId))
                            .map(chatParticipant -> chatParticipant.getUser().getUsername()).findFirst().orElse(null);
                }
                case GROUP -> {
                    return chat.getParticipants().stream()
                            .filter(chatParticipant -> !Objects.equals(chatParticipant.getUser().getId(), userId))
                            .map(chatParticipant -> chatParticipant.getUser().getUsername())
                            .collect(Collectors.joining(", "));
                }
                default -> {
                    return null;
                }
            }
        }
    }

    private static String getChatImgUrl(Chat chat, Long userId) {
        if (chat.getImgUrl() != null) return chat.getImgUrl();
        else {
            switch (chat.getChatType()) {
                case PRIVATE -> {
                    return chat.getParticipants().stream()
                            .filter(cp -> !Objects.equals(cp.getUser().getId(), userId))
                            .findFirst()
                            .map(cp -> cp.getUser().getProfileImage())
                            .orElse(null);
                }
                case GROUP -> {
                    return null;
                    //TODO: implement group images
                }
                default -> {
                    return null;
                }
            }
        }
    }
}
