package com.merkury.vulcanus.model.mappers.chat;

import com.merkury.vulcanus.model.dtos.chat.ChatDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageAttachedFileDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDtoSlice;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageSenderDto;
import com.merkury.vulcanus.model.dtos.chat.ChatParticipantDto;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import com.merkury.vulcanus.model.entities.chat.ChatMessageAttachedFile;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class ChatMapper {

    public static ChatMessageDto toChatMessageDto(ChatMessage chatMessage,
                                                  ChatMessageSenderDto chatMessageSenderDto) {
        if (chatMessage == null) {
            return null;
        }

        List<ChatMessageAttachedFileDto> attachedFiles = null;
        if (chatMessage.getChatMessageAttachedFiles() != null) {
            attachedFiles = chatMessage.getChatMessageAttachedFiles().stream().map(file ->
                            ChatMessageAttachedFileDto.builder()
                                    .url(file.getUrl())
                                    .fileType(file.getFileType())
                                    .sizeInBytes(file.getSizeInBytes())
                                    .name(file.getName())
                                    .build())
                    .toList();
        }

        return ChatMessageDto.builder()
                .id(chatMessage.getId())
                .content(chatMessage.getContent())
                .sentAt(chatMessage.getSentAt())
                .sender(chatMessageSenderDto)
                .chatId(chatMessage.getChat().getId())
                .attachedFiles(attachedFiles)
                .build();
    }

    public static ChatMessageDto toChatMessageDto(ChatMessage chatMessage) {
        var senderDto = ChatMessageSenderDto.builder()
                .id(chatMessage.getSender().getId())
                .name(chatMessage.getSender().getUsername())
                .imgUrl(chatMessage.getSender().getProfilePhoto())
                .build();

        var attachedFiles = chatMessage.getChatMessageAttachedFiles().stream().map(file ->
                        ChatMessageAttachedFileDto.builder()
                                .url(file.getUrl())
                                .fileType(file.getFileType())
                                .sizeInBytes(file.getSizeInBytes())
                                .name(file.getName())
                                .build())
                .toList();

        return ChatMessageDto.builder()
                .id(chatMessage.getId())
                .content(chatMessage.getContent())
                .sentAt(chatMessage.getSentAt())
                .sender(senderDto)
                .chatId(chatMessage.getChat().getId())
                .attachedFiles(attachedFiles)
                .build();
    }

    public static ChatMessageSenderDto toChatMessageSenderDto(ChatMessage chatMessage) {
        if (chatMessage == null) {
            return null;
        }

        return ChatMessageSenderDto.builder()
                .id(chatMessage.getSender().getId())
                .name(chatMessage.getSender().getUsername())
                .imgUrl(chatMessage.getSender().getProfilePhoto())
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
        switch (chat.getChatType()) {
            case PRIVATE -> {
                return chat.getParticipants().stream()
                        .filter(cp -> !Objects.equals(cp.getUser().getId(), userId))
                        .findFirst()
                        .map(cp -> cp.getUser().getProfilePhoto())
                        .orElse(null);
            }
            case GROUP -> {
                return chat.getImgUrl();
            }
            default -> {
                return null;
            }
        }
    }

    public static ChatDto toChatDto(Chat chat, List<ChatMessage> messages, Long userId) {
        var messageDtos = messages.stream()
                .map(message -> {
                    var senderDto = toChatMessageSenderDto(message);
                    return toChatMessageDto(message, senderDto);
                })
                .collect(Collectors.toList());

        var lastMessage = messageDtos.stream()
                .max(Comparator.comparing(ChatMessageDto::sentAt))
                .orElse(null);

        var participants = chat.getParticipants().stream().map(chatParticipant ->
                        new ChatParticipantDto(
                                chatParticipant.getUser().getUsername(),
                                chatParticipant.getUser().getProfilePhoto())
                )
                .toList();

        return ChatDto.builder()
                .id(chat.getId())
                .name(getChatName(chat, userId))
                .imgUrl(getChatImgUrl(chat, userId))
                .messages(messageDtos)
                .lastMessage(lastMessage)
                .chatType(chat.getChatType())
                .participants(participants)
                .build();
    }

    public static ChatDto toChatDto(Chat chat, Long userId) {
        return ChatDto.builder()
                .id(chat.getId())
                .name(getChatName(chat, userId))
                .imgUrl(getChatImgUrl(chat, userId))
                .messages(null)
                .lastMessage(null)
                .build();
    }


    public static ChatMessageDtoSlice toChatMessageDtoSlice(Slice<ChatMessage> messageSlice) {
        return ChatMessageDtoSlice.builder()
                .messages(messageSlice.getContent().stream().map(ChatMapper::toChatMessageDto).toList())
                .hasNextSlice(messageSlice.hasNext())
                .numberOfMessages(messageSlice.getNumberOfElements())
                .sliceNumber(messageSlice.getNumber())
                .build();
    }

    public static ChatDto toChatDto(Chat chat) {
        var participants = chat.getParticipants().stream().map(chatParticipant ->
                        new ChatParticipantDto(
                                chatParticipant.getUser().getUsername(),
                                chatParticipant.getUser().getProfilePhoto())
                )
                .toList();

        return ChatDto.builder()
                .id(chat.getId())
                .name(chat.getName())
                .messages(null)
                .lastMessage(null)
                .participants(participants)
                .chatType(chat.getChatType())
                .build();
    }
}
