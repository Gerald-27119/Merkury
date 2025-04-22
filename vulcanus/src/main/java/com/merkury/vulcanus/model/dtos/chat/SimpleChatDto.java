package com.merkury.vulcanus.model.dtos.chat;

import lombok.Builder;

@Builder
public record SimpleChatDto(Long id, String name, ChatMessageDto lastMessageDto, String imgUrl) {
}
