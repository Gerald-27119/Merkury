package com.merkury.vulcanus.model.dtos.spot;

import lombok.Builder;

@Builder
public record NearbySpotDto(SearchSpotDto searchSpotDto,
                            double distance) {
}
