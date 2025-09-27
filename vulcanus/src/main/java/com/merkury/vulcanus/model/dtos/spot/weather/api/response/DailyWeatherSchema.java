package com.merkury.vulcanus.model.dtos.spot.weather.api.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DailyWeatherSchema(
        @JsonProperty("uv_index_max") List<Double> uvIndexMax
        ) {
}
