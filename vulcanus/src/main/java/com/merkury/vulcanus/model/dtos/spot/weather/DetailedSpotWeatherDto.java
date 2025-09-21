package com.merkury.vulcanus.model.dtos.spot.weather;

public record DetailedSpotWeatherDto(
        Double temperature,
        int weatherCode,
        Double precipitationProbability,
        Double dewPoint,
        Double relativeHumidity,
        boolean isDay,
        Double uvIndexMax
) {
}
