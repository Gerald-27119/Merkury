package com.merkury.vulcanus.model.dtos.spot.weather.api.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CurrentWeatherSchema(@JsonProperty("temperature_2m") Double temperature2m,
                                   @JsonProperty("weather_code") Integer weatherCode,
                                   @JsonProperty("wind_speed_10m") Double windSpeed10m,
                                   @JsonProperty("is_day") Integer isDay,
                                   @JsonProperty("precipitation_probability") Double precipitationProbability,
                                   @JsonProperty("dew_point_2m") Double dewPoint2m,
                                   @JsonProperty("relative_humidity_2m") Double relativeHumidity2m) {
}
