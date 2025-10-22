package com.merkury.vulcanus.model.dtos.chat.group;

import org.springframework.web.multipart.MultipartFile;

public record UpdateGroupChatDto(String newName, MultipartFile image) {
}
