package com.merkury.vulcanus.model.dtos.chat;

public record ChatMessageAckDto(ChatMessageDto chatMessageDto, String optimisticMessageUUID) {

}
