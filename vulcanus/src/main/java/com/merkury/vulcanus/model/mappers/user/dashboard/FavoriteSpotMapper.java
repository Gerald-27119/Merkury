package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotDto;
import com.merkury.vulcanus.model.dtos.spot.coordinates.SpotCoordinatesDto;
import com.merkury.vulcanus.model.entities.FavoriteSpot;
import com.merkury.vulcanus.model.mappers.SpotTagMapper;
import jakarta.validation.constraints.NotNull;

import java.util.Optional;
import java.util.stream.Collectors;

public class FavoriteSpotMapper {
    private FavoriteSpotMapper() {
    }

    public static FavoriteSpotDto toDto(@NotNull FavoriteSpot favoriteSpot) {
        return FavoriteSpotDto.builder()
                .id(favoriteSpot.getSpot().getId())
                .name(favoriteSpot.getSpot().getName())
                .country(favoriteSpot.getSpot().getCountry())
                .city(favoriteSpot.getSpot().getCity())
                .description(favoriteSpot.getSpot().getDescription())
                .rating(favoriteSpot.getSpot().getRating())
                .viewsCount(favoriteSpot.getSpot().getViewsCount())
                .imageUrl(favoriteSpot.getSpot().getImages().isEmpty() ? null :
                        favoriteSpot.getSpot().getImages().getFirst().getUrl())
                .type(favoriteSpot.getType())
                .coords(
                Optional.ofNullable(favoriteSpot.getSpot().getCenterPoint())
                        .map(cp -> new SpotCoordinatesDto(cp.getX(), cp.getY()))
                        .orElse(null))
                .tags(favoriteSpot.getSpot().getTags().stream().map(SpotTagMapper::toDto).collect(Collectors.toSet()))
                .build();
    }
}
