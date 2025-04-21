package com.merkury.vulcanus.model.dtos.chat;

import lombok.Builder;

@Builder
public record ChatMessageSenderDto(Long id, String name, String profileImg) {

}
