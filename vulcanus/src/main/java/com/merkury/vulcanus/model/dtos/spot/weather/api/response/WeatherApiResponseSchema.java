package com.merkury.vulcanus.model.dtos.spot.weather.api.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record WeatherApiResponseSchema(CurrentWeatherSchema current) {
}
