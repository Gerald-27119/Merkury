package com.merkury.vulcanus.model.dtos.chat.group;

import java.util.List;

public record CreateChatDto(List<String> usernames, String ownerUsername) {
}
