package com.merkury.vulcanus.model.dtos.chat;

import lombok.Builder;

import java.util.List;

@Builder
public record SimpleChatDto(Long id, String name, ChatMessageDto lastMessage, String imgUrl, List<ChatMessageDto> messages) {
}
