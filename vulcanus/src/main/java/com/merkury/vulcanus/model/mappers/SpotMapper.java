package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.spot.FullSpotDto;
import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.dtos.spot.weather.WeatherApiCallCordsDto;
import com.merkury.vulcanus.model.entities.SpotComment;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.Spot;
import jakarta.validation.constraints.NotNull;

import java.util.List;

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
                .area(spot.getArea())
                .build();
    }

    public static Spot toEntity(@NotNull FullSpotDto dto,
                                @NotNull List<BorderPoint> points,
                                @NotNull List<SpotComment> spotComments,
                                @NotNull List<Img> images) {
        return Spot.builder()
                .areaColor(dto.areaColor())
                .name(dto.name())
                .description(dto.description())
                .rating(dto.rating())
                .viewsCount(dto.viewsCount())
                .borderPoints(points)
                .spotComments(spotComments)
                .images(images)
                .build();
    }

    public static SpotDetailsDto toDetailsDto(@NotNull Spot spot) {
        return SpotDetailsDto.builder()
                .id(spot.getId())
                .name(spot.getName())
                .description(spot.getDescription())
                .rating(spot.getRating())
                .viewsCount(spot.getViewsCount())
                .photos(spot.getImages().stream()
                        .map(ImgMapper::toDto)
                        .toList())
                .weatherApiCallCoords(new WeatherApiCallCordsDto(
                        spot.getBorderPoints().getFirst().getX(),
                        spot.getBorderPoints().getFirst().getY()))
                .build();
    }
}


