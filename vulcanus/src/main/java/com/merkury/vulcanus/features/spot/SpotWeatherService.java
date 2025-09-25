package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.model.dtos.spot.weather.BasicSpotWeatherDto;
import com.merkury.vulcanus.model.dtos.spot.weather.DetailedSpotWeatherDto;
import com.merkury.vulcanus.model.dtos.spot.weather.SpotWeatherTimelinePlotDataDto;
import com.merkury.vulcanus.model.dtos.spot.weather.SpotWeatherWindSpeedsDto;
import com.merkury.vulcanus.model.dtos.spot.weather.api.response.WeatherApiResponseSchema;
import com.merkury.vulcanus.utils.TimeUtils;
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

    public Mono<DetailedSpotWeatherDto> getDetailedSpotWeather(double latitude, double longitude) {
        return spotWeatherWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("latitude", latitude)
                        .queryParam("longitude", longitude)
                        .queryParam("current", List.of(
                                "temperature_2m",
                                "weather_code",
                                "precipitation_probability",
                                "dew_point_2m",
                                "relative_humidity_2m",
                                "is_day"))
                        .queryParam("daily", List.of("uv_index_max"))
                        .build())
                .retrieve()
                .bodyToMono(WeatherApiResponseSchema.class)
                .map(response -> new DetailedSpotWeatherDto(
                        response.current().temperature2m(),
                        response.current().weatherCode(),
                        response.current().precipitationProbability(),
                        response.current().dewPoint2m(),
                        response.current().relativeHumidity2m(),
                        response.current().isDay() != 0,
                        response.daily().uvIndexMax().getFirst())
                );
    }

    public Mono<SpotWeatherWindSpeedsDto> getSpotWeatherWindSpeeds(double latitude, double longitude) {
        return spotWeatherWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("latitude", latitude)
                        .queryParam("longitude", longitude)
                        .queryParam("hourly", List.of(
                                "wind_speed_1000hPa",
                                "wind_speed_180m",
                                "wind_speed_975hPa",
                                "wind_speed_950hPa",
                                "wind_speed_925hPa",
                                "wind_speed_900hPa"))
                        .queryParam("start_hour", TimeUtils.getISO8601Time(0))
                        .queryParam("end_hour", TimeUtils.getISO8601Time(0))
                        .queryParam("wind_speed_unit", "ms")
                        .build())
                .retrieve()
                .bodyToMono(WeatherApiResponseSchema.class)
                .map(response -> new SpotWeatherWindSpeedsDto(
                        response.hourly().windSpeed1000hPa(),
                        response.hourly().windSpeed180m(),
                        response.hourly().windSpeed975hPa(),
                        response.hourly().windSpeed950hPa(),
                        response.hourly().windSpeed925hPa(),
                        response.hourly().windSpeed900hPa()
                ));
    }

    public Mono<SpotWeatherTimelinePlotDataDto> getSpotWeatherTimelinePlotData(double latitude, double longitude) {
        return spotWeatherWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("latitude", latitude)
                        .queryParam("longitude", longitude)
                        .queryParam("hourly", List.of(
                                "temperature_2m",
                                "weather_code",
                                "precipitation_probability",
                                "is_day"))
                        .queryParam("start_hour", TimeUtils.getISO8601Time(0))
                        .queryParam("end_hour", TimeUtils.getISO8601Time(3))
                        .build())
                .retrieve()
                .bodyToMono(WeatherApiResponseSchema.class)
                .map(response -> new SpotWeatherTimelinePlotDataDto(
                        response.hourly().time(),
                        response.hourly().temperature2m(),
                        response.hourly().weatherCode(),
                        response.hourly().precipitationProbability(),
                        response.hourly().isDay().stream().map(isDay -> (isDay != 0)).toList()
                ));
    }
}
