package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotDto;
import com.merkury.vulcanus.model.entities.FavoriteSpot;
import com.merkury.vulcanus.model.mappers.SpotTagMapper;
import jakarta.validation.constraints.NotNull;

import java.util.stream.Collectors;

public class FavoriteSpotMapper {
    private FavoriteSpotMapper() {
    }

    public static FavoriteSpotDto toDto(@NotNull FavoriteSpot favoriteSpot) {
        return FavoriteSpotDto.builder()
                .id(favoriteSpot.getId())
                .name(favoriteSpot.getSpot().getName())
                .country(favoriteSpot.getSpot().getCountry())
                .description(favoriteSpot.getSpot().getDescription())
                .rating(favoriteSpot.getSpot().getRating())
                .viewsCount(favoriteSpot.getSpot().getViewsCount())
                .image(favoriteSpot.getSpot().getImages().getFirst())
                .type(favoriteSpot.getType())
                .tags(favoriteSpot.getSpot().getTags().stream().map(SpotTagMapper::toDto).collect(Collectors.toSet()))
                .build();
    }
}
