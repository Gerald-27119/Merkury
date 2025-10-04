package com.merkury.vulcanus.model.dtos.spot.gallery;

import com.merkury.vulcanus.model.enums.GenericMediaType;

import java.time.LocalDateTime;

public record SpotMediaGalleryDto(
        Long id,
        String url,
        GenericMediaType mediaType,
        int likesNumber,
        LocalDateTime publishDate,
        String authorName,
        String authorProfilePhotoUrl
) {
}
