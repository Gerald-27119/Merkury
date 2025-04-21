package com.merkury.vulcanus.model.dtos.chat;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record LastMessageDto(Long id, String content, LocalDateTime sentAt, String senderName) {
}
