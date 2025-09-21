package com.merkury.vulcanus.model.dtos.spot.weather;

public record BasicSpotWeatherDto(
        Double temperature,
        int weatherCode,
        Double windSpeed,
        boolean isDay
) {
}
