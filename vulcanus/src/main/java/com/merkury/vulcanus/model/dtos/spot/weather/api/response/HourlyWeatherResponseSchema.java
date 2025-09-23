package com.merkury.vulcanus.model.dtos.spot.weather.api.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HourlyWeatherResponseSchema(
        @JsonProperty("wind_speed_1000hPa") List<Double> windSpeed1000hPa,
        @JsonProperty("wind_speed_180m") List<Double> windSpeed180m,
        @JsonProperty("wind_speed_975hPa") List<Double> windSpeed975hPa,
        @JsonProperty("wind_speed_950hPa") List<Double> windSpeed950hPa,
        @JsonProperty("wind_speed_925hPa") List<Double> windSpeed925hPa,
        @JsonProperty("wind_speed_900hPa") List<Double> windSpeed900hPa
) {
}
