package com.merkury.vulcanus.model.dtos.account.profile;


import lombok.Builder;

@Builder
public record ImageDto(String src,
                       Integer heartsCount,
                       Integer viewsCount,
                       String title,
                       Long id) {
}
