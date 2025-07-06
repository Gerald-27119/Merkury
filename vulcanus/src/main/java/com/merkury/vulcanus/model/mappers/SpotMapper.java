package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.spot.FullSpotDto;
import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SearchSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.dtos.spot.coordinates.SpotCoordinatesDto;
import com.merkury.vulcanus.model.entities.SpotComment;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.SpotMedia;
import com.merkury.vulcanus.model.enums.MediaType;
import jakarta.validation.constraints.NotNull;

import java.util.List;
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
                .borderPoints(points)
                .spotComments(spotComments)
                .images(images)
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
                //TODO: delete photos
                .photos(spot.getImages().stream()
                        .map(ImgMapper::toDto)
                        .toList())
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
                        .filter(spotMedia -> spotMedia.getMediaType().equals(MediaType.PHOTO))
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


