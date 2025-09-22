package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.model.dtos.spot.weather.BasicSpotWeatherDto;
import com.merkury.vulcanus.model.dtos.spot.weather.api.response.WeatherApiResponseSchema;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotWeatherService {
    @Qualifier("spotWeather")
    private final WebClient spotWeatherWebClient;

    public Mono<BasicSpotWeatherDto> getBasicSpotWeather(double latitude, double longitude) {
        return spotWeatherWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("latitude", latitude)
                        .queryParam("longitude", longitude)
                        .queryParam("current", List.of(
                                "temperature_2m",
                                "weather_code",
                                "wind_speed_10m",
                                "is_day"))
                        .queryParam("wind_speed_unit", "ms")
                        .build())
                .retrieve()
                .bodyToMono(WeatherApiResponseSchema.class)
                .map(response -> new BasicSpotWeatherDto(
                        response.current().temperature2m(),
                        response.current().weatherCode(),
                        response.current().windSpeed10m(),
                        response.current().isDay() != 0));
    }
}
