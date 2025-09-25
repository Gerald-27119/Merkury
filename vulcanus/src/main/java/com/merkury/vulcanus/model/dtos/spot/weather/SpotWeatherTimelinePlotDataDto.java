package com.merkury.vulcanus.model.dtos.spot.weather;

public record SpotWeatherTimelinePlotDataDto(
        String time,
        Double temperature,
        Integer weatherCode,
        Double precipitationProbability,
        Boolean isDay
) {
}
