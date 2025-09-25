package com.merkury.vulcanus.model.dtos.spot.weather;

public record SpotWeatherWindSpeedsDto(
        Double windSpeeds100m,
        Double windSpeeds200m,
        Double windSpeeds300m,
        Double windSpeeds500m,
        Double windSpeeds750m,
        Double windSpeeds1000m
) {
}
