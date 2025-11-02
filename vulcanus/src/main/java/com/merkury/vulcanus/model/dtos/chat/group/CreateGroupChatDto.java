package com.merkury.vulcanus.model.dtos.chat.group;

import org.springframework.lang.Nullable;

import java.util.List;

public record CreateGroupChatDto(List<String> usernames, @Nullable String ownerUsername) {
}
