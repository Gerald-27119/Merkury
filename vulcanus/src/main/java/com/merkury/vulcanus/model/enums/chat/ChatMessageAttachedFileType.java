package com.merkury.vulcanus.model.enums.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@Getter
@AllArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public enum ChatMessageAttachedFileType {

    JPEG("image/jpeg"),
    PNG("image/png"),
    GIF("image/gif"),
    WEBP("image/webp"),
    SVG("image/svg+xml"),
    PDF("application/pdf"),
    DOC("application/msword"),
    DOCX("application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    XLS("application/vnd.ms-excel"),
    XLSX("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    PPT("application/vnd.ms-powerpoint"),
    PPTX("application/vnd.openxmlformats-officedocument.presentationml.presentation"),
    CSV("text/csv"),
    TXT("text/plain"),
    JSON("application/json"),
    XML("application/xml"),
    ZIP("application/zip"),
    RAR("application/vnd.rar"),
    _7Z("application/x-7z-compressed");

    private final String contentType;

    public static boolean isInvalid(String contentType) {
        return Arrays.stream(values())
                .noneMatch(type -> type.getContentType().equalsIgnoreCase(contentType));
    }
}
