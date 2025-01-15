package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.spot.FullSpotDto;
import com.merkury.vulcanus.model.dtos.spot.SpotDetailsDto;
import com.merkury.vulcanus.model.dtos.spot.GeneralSpotDto;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.Point;
import com.merkury.vulcanus.model.entities.Spot;

import java.util.List;

public class SpotMapper {

    private SpotMapper() {
    }

    public static GeneralSpotDto toDto(Spot spot) {
        if (spot == null) {
            return null;
        }

        return new GeneralSpotDto(
                spot.getId(),
                spot.getAreaColor(),
                spot.getName(),
                spot.getRating(),
                spot.getBorderPoints()
                        .stream()
                        .map(point -> new Double[]{point.getX(), point.getY()})
                        .toList()
        );
    }

    public static Spot toEntity(FullSpotDto dto, List<Point> points, List<Comment> comments, List<Img> images) {
        if (dto == null) {
            return null;
        }

        Spot spot = new Spot();
        spot.setAreaColor(dto.areaColor());
        spot.setName(dto.name());
        spot.setDescription(dto.description());
        spot.setRating(dto.rating());
        spot.setViewsCount(dto.viewsCount());

        spot.setBorderPoints(points);

        spot.setComments(comments);
        spot.setImages(images);

        return spot;
    }

    public static SpotDetailsDto toDetailsDto(Spot spot) {
        if (spot == null) {
            return null;
        }

        return new SpotDetailsDto(
                spot.getId(),
                spot.getName(),
                spot.getDescription(),
                spot.getRating(),
                spot.getViewsCount(),
                spot.getImages()
                        .stream()
                        .map(ImgMapper::toDto)
                        .toList());
    }
}


