package com.merkury.vulcanus.model.dtos.chat;

import lombok.Builder;

import java.util.List;

@Builder
public record ChatMessageDtoSlice(List<ChatMessageDto> messages, Boolean hasNextSlice, Integer numberOfMessages,
                                  Integer sliceNumber) {
}
