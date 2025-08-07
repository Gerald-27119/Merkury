package com.merkury.vulcanus.model.dtos.spot;

import lombok.Builder;

@Builder
public record TopRatedSpotDto(Long id,
                              String name,
                              String city,
                              String imageUrl) {
}
