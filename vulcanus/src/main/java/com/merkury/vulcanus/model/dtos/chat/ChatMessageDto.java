package com.merkury.vulcanus.model.dtos.chat;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder(toBuilder = true)
public record ChatMessageDto(Long id, ChatMessageSenderDto sender, LocalDateTime sentAt, String content, Long chatId) {
}
