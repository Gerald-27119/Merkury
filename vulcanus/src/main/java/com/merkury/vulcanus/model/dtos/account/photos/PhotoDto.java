package com.merkury.vulcanus.model.dtos.account.photos;

import lombok.Builder;


@Builder
public record PhotoDto(String src,
                       Integer heartsCount,
                       Integer viewsCount,
                       Long id) {
}
