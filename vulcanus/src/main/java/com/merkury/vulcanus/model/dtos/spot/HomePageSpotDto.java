package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.embeddable.BorderPoint;
import lombok.Builder;

import java.util.Set;

@Builder
public record HomePageSpotDto(Long id,
                              String name,
                              Double rating,
                              Integer ratingCount,
                              String firstPhoto,
                              Set<SpotTagDto> tags,
                              BorderPoint centerPoint,
                              String city,
                              Double distanceToUser) {
}
