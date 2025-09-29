package com.merkury.vulcanus.model.enums.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@Getter
@AllArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public enum ChatMessageAttachedFileType {
    JPEG("image/jpeg"),
    PNG("image/png"),
    GIF("image/gif");

    private final String contentType;

    public static boolean isInvalid(String contentType) {
        return Arrays.stream(values())
                .noneMatch(type -> type.getContentType().equalsIgnoreCase(contentType));
    }
}
