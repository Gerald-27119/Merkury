package com.merkury.vulcanus.model.dtos.chat;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder(toBuilder = true)
public record IncomingChatMessageDto(LocalDateTime sentAt, String content, Long chatId) {
}
