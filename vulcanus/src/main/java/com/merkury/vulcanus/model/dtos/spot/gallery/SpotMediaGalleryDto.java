package com.merkury.vulcanus.model.dtos.spot.gallery;

import com.merkury.vulcanus.model.enums.GenericMediaType;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record SpotMediaGalleryDto(
        Long id,
        String url,
        GenericMediaType mediaType,
        int likesNumber,
        LocalDate publishDate,
        String authorName,
        String authorProfilePhotoUrl
) {
}
