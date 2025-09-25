package com.merkury.vulcanus.model.dtos.spot.weather;

import java.io.Serial;
import java.io.Serializable;

public record BasicSpotWeatherDto(
        Double temperature,
        int weatherCode,
        Double windSpeed,
        boolean isDay
) implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
}
