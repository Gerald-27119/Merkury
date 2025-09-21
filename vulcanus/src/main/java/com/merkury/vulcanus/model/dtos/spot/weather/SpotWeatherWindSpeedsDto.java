package com.merkury.vulcanus.model.dtos.spot.weather;

import java.util.List;

public record SpotWeatherWindSpeedsDto(
        List<Double> windSpeeds100m,
        List<Double> windSpeeds200m,
        List<Double> windSpeeds300m,
        List<Double> windSpeeds500m,
        List<Double> windSpeeds750m,
        List<Double> windSpeeds1000m
) {
}
