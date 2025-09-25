package com.merkury.vulcanus.model.dtos.spot.weather;

import java.util.List;

public record SpotWeatherTimelinePlotDataDto(
        List<String> time,
        List<Double> temperature,
        List<Integer> weatherCode,
        List<Double> precipitationProbability,
        List<Boolean> isDay
) {
}
