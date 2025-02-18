package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.spot.FavouriteSpotDto;
import com.merkury.vulcanus.model.entities.Spot;
import jakarta.validation.constraints.NotNull;

public class FavouriteSpotMapper {

    private FavouriteSpotMapper() {
    }

    public static FavouriteSpotDto toDto(@NotNull Spot spot) {

        return FavouriteSpotDto.builder()
                .id(spot.getId())
                .name(spot.getName())
                .img(spot.getImages().isEmpty() ? null : ImgMapper.toDto(spot.getImages().getFirst()))
                .build();
    }
}
