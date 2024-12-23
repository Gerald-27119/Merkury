package com.merkury.vulcanus.model.mappers;

import com.merkury.vulcanus.model.dtos.PointDto;
import com.merkury.vulcanus.model.entities.Point;
import com.merkury.vulcanus.model.dtos.ContourCoordinatesDto;

import java.util.List;
import java.util.stream.Collectors;

public class PointMapper {

    public static PointDto toDto(Point point) {
        if (point == null) {
            return null;
        }

        return new PointDto(point.getX(), point.getY());
    }

    public static ContourCoordinatesDto toContourDto(List<Point> points) {
        List<Double[]> coordinates = points.stream()
                .map(point -> new Double[]{point.getX(), point.getY()})
                .collect(Collectors.toList());

        return new ContourCoordinatesDto(coordinates);
    }
}

