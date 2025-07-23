package com.merkury.vulcanus.model.mappers.spot;

import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SearchSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.dtos.spot.coordinates.SpotCoordinatesDto;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import jakarta.validation.constraints.NotNull;

import java.util.stream.Collectors;

public class SpotMapper {

    private SpotMapper() {
    }

    public static GeneralSpotDto toDto(@NotNull Spot spot) {
        return GeneralSpotDto.builder()
                .id(spot.getId())
                .areaColor(spot.getAreaColor())
                .name(spot.getName())
                .rating(spot.getRating())
                .contourCoordinates(spot.getBorderPoints()
                        .stream()
                        .map(point -> new Double[]{point.getX(), point.getY()})
                        .toList())
                .centerPoint(spot.getCenterPoint())
                .area(spot.getArea())
                .build();
    }

    public static SpotDetailsDto toDetailsDto(@NotNull Spot spot) {
        return SpotDetailsDto.builder()
                .id(spot.getId())
                .name(spot.getName())
                .country(spot.getCountry())
                .city(spot.getCity())
                .street(spot.getStreet())
                .description(spot.getDescription())
                .rating(spot.getRating())
                .ratingCount(spot.getRatingCount())
                .media(spot.getMedia().stream()
                        .map(SpotMediaMapper::toDto)
                        .toList())
                .tags(spot.getTags().stream()
                        .map(SpotTagMapper::toDto)
                        .collect(Collectors.toSet()))
                .weatherApiCallCoords(new SpotCoordinatesDto(
                        spot.getBorderPoints().getFirst().getX(),
                        spot.getBorderPoints().getFirst().getY()))
                .build();
    }

    public static SearchSpotDto toSearchSpotDto(@NotNull Spot spot) {
        return SearchSpotDto.builder()
                .id(spot.getId())
                .name(spot.getName())
                .rating(spot.getRating())
                .ratingCount(spot.getRatingCount())
                .firstPhoto(spot.getMedia().stream()
                        .filter(spotMedia -> spotMedia.getGenericMediaType() == GenericMediaType.PHOTO)
                        .findFirst()
                        .map(SpotMedia::getUrl)
                        .orElse("photoNotFound"))
                .tags(spot.getTags().stream()
                        .map(SpotTagMapper::toDto)
                        .collect(Collectors.toSet()))
                .centerPoint(spot.getCenterPoint())
                .build();
    }
}


