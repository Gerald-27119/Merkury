package com.merkury.vulcanus.model.dtos.chat;

import com.merkury.vulcanus.model.enums.chat.ChatType;
import lombok.Builder;

import java.util.List;

/**
 * Represents a chat with its basic details, including the last message and a list of messages.
 * This DTO enables frontend to both show a chat list and detailed view of a chat.
 * @author Adam Langmesser
 */
@Builder
public record ChatDto(Long id, String name, ChatMessageDto lastMessage, String imgUrl, List<ChatMessageDto> messages, ChatType chatType, List<ChatParticipantDto> participants) {

}
