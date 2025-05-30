package com.merkury.vulcanus.model.dtos.account.spots;

import com.merkury.vulcanus.model.dtos.spot.SpotTagDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.enums.user.dashboard.SpotsListType;
import lombok.Builder;

import java.util.Set;

@Builder
public record FavoriteSpotDto(Long id,
                              String name,
                              String country,
                              String description,
                              Double rating,
                              Integer viewsCount,
                              Img image,
                              SpotsListType type,
                              Set<SpotTagDto> tags) {
}
