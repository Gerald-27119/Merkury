package com.merkury.vulcanus.model.dtos.spot.weather;

import java.io.Serial;
import java.io.Serializable;

public record SpotWeatherTimelinePlotDataDto(
        String time,
        Double temperature,
        Integer weatherCode,
        Double precipitationProbability,
        Boolean isDay
) implements Serializable {
    @Serial
    private static final long serialVersionUID = 4L;
}
