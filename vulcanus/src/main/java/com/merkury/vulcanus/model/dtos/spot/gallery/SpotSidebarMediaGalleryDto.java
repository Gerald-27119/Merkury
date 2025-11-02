package com.merkury.vulcanus.model.dtos.spot.gallery;

import com.merkury.vulcanus.model.enums.GenericMediaType;
import lombok.Builder;

@Builder
public record SpotSidebarMediaGalleryDto(Long id,
                                         String url,
                                         GenericMediaType mediaType) {
}
