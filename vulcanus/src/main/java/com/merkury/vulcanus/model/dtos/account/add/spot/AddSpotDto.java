package com.merkury.vulcanus.model.dtos.account.add.spot;

import com.merkury.vulcanus.model.embeddable.BorderPoint;
import lombok.Builder;

import java.util.List;

@Builder
public record AddSpotDto(Long id,
                         String name,
                         String description,
                         String country,
                         String region,
                         String city,
                         String street,
                         List<BorderPoint> borderPoints,
                         String firstPhotoUrl) {
}
