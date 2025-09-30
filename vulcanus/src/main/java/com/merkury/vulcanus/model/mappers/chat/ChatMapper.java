package com.merkury.vulcanus.model.mappers.chat;

import com.merkury.vulcanus.model.dtos.chat.ChatDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageAttachedFileDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageDtoSlice;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageSenderDto;
import com.merkury.vulcanus.model.dtos.chat.DetailedChatDto;
import com.merkury.vulcanus.model.dtos.chat.SimpleChatDto;
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

    public static SimpleChatDto toSimpleChatDto(Chat chat, ChatMessage lastMessage, Long userId, List<ChatMessage> chatMessages) {
//        TODO:Get rid off
        var messageSenderDto = toChatMessageSenderDto(lastMessage);
        var lastMessageDto = ChatMapper.toChatMessageDto(lastMessage, messageSenderDto);

        var chatMessageDtoList = chatMessages.stream()
                .map(chatMessage -> {
//                    TODO:change name
                    var messageSenderDto1 = toChatMessageSenderDto(chatMessage);
                    return ChatMapper.toChatMessageDto(chatMessage, messageSenderDto1);
                })
                .toList();

        return SimpleChatDto.builder()
                .id(chat.getId())
                .name(getChatName(chat, userId))
                .lastMessage(lastMessageDto)
                .imgUrl(getChatImgUrl(chat, userId))
                .messages(chatMessageDtoList)
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
        }//to ta jest zbędna?

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
                .imgUrl(chatMessage.getSender().getProfileImage())
                .build();
//        TODO: ta metoda jest potrzebna?

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
                .imgUrl(chatMessage.getSender().getProfileImage())
                .build();
    }

    private static String getChatName(Chat chat, Long userId) {
        if (chat.getName() != null) return chat.getName();
        else {
            switch (chat.getChatType()) {
                case PRIVATE -> {
                    return chat.getParticipants().stream()//TODO:aaaaa, username
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

    public static ChatDto toChatDto(Chat chat, List<ChatMessage> messages, Long userId) {

        //TODO: null check for chat and messages?

        var messageDtos = messages.stream()
                .map(message -> {
                    var senderDto = toChatMessageSenderDto(message);
                    return toChatMessageDto(message, senderDto);
                })
                .collect(Collectors.toList());

        var lastMessage = messageDtos.stream()
                .max(Comparator.comparing(ChatMessageDto::sentAt))
                .orElse(null);

        return ChatDto.builder()
                .id(chat.getId())
                .name(getChatName(chat, userId))//TODO:reafactor
                .imgUrl(getChatImgUrl(chat, userId))//TODO:refactor
                .messages(messageDtos)
                .lastMessage(lastMessage)
                .chatType(chat.getChatType())
                .build();
    }

    public static ChatDto toChatDto(Chat chat, Long userId) {

        //TODO: null check for chat and messages?

        return ChatDto.builder()
                .id(chat.getId())
                .name(getChatName(chat, userId))//TODO:reafactor
                .imgUrl(getChatImgUrl(chat, userId))//TODO:refactor
                .messages(null)//pusta lsita lepiej?
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

    public static ChatMessageAttachedFile toChatMessageAttachedFile(MultipartFile file, ChatMessage chatMessage) {
        return ChatMessageAttachedFile.builder()
                .name(file.getName())
                .chatMessage(chatMessage)
                .url("")//....?
                .build();
    }
}
