package com.merkury.vulcanus.model.dtos.account.spots;

import com.merkury.vulcanus.model.dtos.spot.SpotTagDto;
import com.merkury.vulcanus.model.dtos.spot.coordinates.SpotCoordinatesDto;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import lombok.Builder;

import java.util.Set;

@Builder
public record FavoriteSpotDto(Long id,
                              String name,
                              String country,
                              String city,
                              String description,
                              Double rating,
                              Integer viewsCount,
                              String imageUrl,
                              FavoriteSpotsListType type,
                              SpotCoordinatesDto cords,
                              Set<SpotTagDto> tags) {
}
