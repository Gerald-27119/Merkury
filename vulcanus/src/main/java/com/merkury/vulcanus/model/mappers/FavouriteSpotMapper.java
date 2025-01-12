package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.FavouriteSpotDto;
import com.merkury.vulcanus.model.entities.Spot;

import java.util.stream.Collectors;

public class FavouriteSpotMapper {

    public static FavouriteSpotDto toDto(Spot spot) {
        if (spot == null) {
            return null;
        }

        return FavouriteSpotDto.builder()
                .id(spot.getId())
                .name(spot.getName())
                .photos(spot.getImages().stream()
                        .map(ImgMapper::toDto)
                        .collect(Collectors.toList()))
                .build();

    }
}
