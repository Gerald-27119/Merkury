package com.merkury.vulcanus.model.dtos.chat;

import lombok.Builder;

import java.util.List;

@Builder
public record DetailedChatDto(Long id, String name, List<ChatMessageDto> messages, String imgUrl) {
}
