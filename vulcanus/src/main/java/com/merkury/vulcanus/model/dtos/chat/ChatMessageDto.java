package com.merkury.vulcanus.model.dtos.chat;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder(toBuilder = true)
public record ChatMessageDto(Long id, ChatMessageSenderDto sender, LocalDateTime sentAt, String content, Long chatId, List<ChatMessageAttachedFileDto> attachedFiles) {
}
