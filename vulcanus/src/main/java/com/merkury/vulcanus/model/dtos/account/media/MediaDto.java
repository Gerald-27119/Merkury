package com.merkury.vulcanus.model.dtos.account.media;

import lombok.Builder;


@Builder
public record MediaDto(String src,
                       Integer heartsCount,
                       Integer viewsCount,
                       Long id) {
}
