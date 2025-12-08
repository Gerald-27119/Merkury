package com.merkury.vulcanus.model.enums.forum;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum ForumMediaAttachedFileType {
    JPEG("image/jpeg"),
    PNG("image/png"),
    GIF("image/gif"),
    WEBP("image/webp");

    private final String contentType;

    public static boolean isInvalid(String contentType) {
        return Arrays.stream(values())
                .noneMatch(type -> type.getContentType().equalsIgnoreCase(contentType));
    }
}
