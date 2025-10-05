package com.merkury.vulcanus.model.dtos.spot.weather.api.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TimeZoneApiResponseSchema(@JsonProperty("timezone_id") String timezoneId) {
}
