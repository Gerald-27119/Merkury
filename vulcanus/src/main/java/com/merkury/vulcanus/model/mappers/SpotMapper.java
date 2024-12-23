package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.SpotDto;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.Point;
import com.merkury.vulcanus.model.entities.Spot;

import java.util.List;
import java.util.stream.Collectors;

public class SpotMapper {

    public static SpotDto toDto(Spot spot) {
        if (spot == null) {
            return null;
        }

        return SpotDto.builder()
                .areaColor(spot.getAreaColor())
                .name(spot.getName())
                .description(spot.getDescription())

                .contourCoordinates(spot.getBorderPoints().stream()
                        .map(point -> new Double[]{point.getX(), point.getY()})
                        .collect(Collectors.toList()))

                .comments(spot.getComments().stream()
                        .map(CommentMapper::toDto)
                        .collect(Collectors.toList()))

                .rating(spot.getRating())
                .viewsCount(spot.getViewsCount())

                .photos(spot.getImages().stream()
                        .map(ImgMapper::toDto)
                        .collect(Collectors.toList()))

                .build();
    }

    public static Spot toEntity(SpotDto dto, List<Point> points, List<Comment> comments, List<Img> images) {
        if (dto == null) {
            return null;
        }

        Spot spot = new Spot();
        spot.setAreaColor(dto.getAreaColor());
        spot.setName(dto.getName());
        spot.setDescription(dto.getDescription());
        spot.setRating(dto.getRating());
        spot.setViewsCount(dto.getViewsCount());

        spot.setBorderPoints(points);

        spot.setComments(comments);
        spot.setImages(images);

        return spot;
    }
}


