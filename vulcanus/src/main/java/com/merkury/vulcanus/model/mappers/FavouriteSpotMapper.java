package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.spot.FavouriteSpotDto;
import com.merkury.vulcanus.model.entities.Spot;
import jakarta.validation.constraints.NotNull;

public class FavouriteSpotMapper {

    public static FavouriteSpotDto toDto(@NotNull Spot spot) {
        return new FavouriteSpotDto(
                spot.getId(),
                spot.getName(),
                spot.getImages().stream().map(ImgMapper::toDto).toList()
        );
    }
}
