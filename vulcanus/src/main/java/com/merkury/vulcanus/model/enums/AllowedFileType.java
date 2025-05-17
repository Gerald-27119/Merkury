package com.merkury.vulcanus.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum AllowedFileType {
    JPEG("image/jpeg"),
    PNG("image/png"),
    GIF("image/gif"),
    MP4("video/mp4");

    private final String contentType;

    public static boolean isAllowed(String contentType) {
        return Arrays.stream(values())
                .anyMatch(type -> type.getContentType().equalsIgnoreCase(contentType));
    }
}
