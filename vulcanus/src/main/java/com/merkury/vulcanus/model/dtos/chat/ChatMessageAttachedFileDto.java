package com.merkury.vulcanus.model.dtos.chat;

import lombok.Builder;

@Builder
public record ChatMessageAttachedFileDto(String url, String fileType, long sizeInBytes) {
}
