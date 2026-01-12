package com.merkury.vulcanus.model.dtos.spot.weather;

import java.io.Serial;
import java.io.Serializable;

public record DetailedSpotWeatherDto(
        Double temperature,
        int weatherCode,
        Double precipitationProbability,
        Double dewPoint,
        Double relativeHumidity,
        boolean isDay,
        Double uvIndexMax
) implements Serializable {
    @Serial
    private static final long serialVersionUID = 2L;
}
