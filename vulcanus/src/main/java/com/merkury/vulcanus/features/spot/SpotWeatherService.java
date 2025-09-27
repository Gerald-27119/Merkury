package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.model.dtos.spot.weather.BasicSpotWeatherDto;
import com.merkury.vulcanus.model.dtos.spot.weather.DetailedSpotWeatherDto;
import com.merkury.vulcanus.model.dtos.spot.weather.SpotWeatherTimelinePlotDataDto;
import com.merkury.vulcanus.model.dtos.spot.weather.SpotWeatherWindSpeedsDto;
import com.merkury.vulcanus.model.dtos.spot.weather.api.response.WeatherApiResponseSchema;
import com.merkury.vulcanus.utils.TimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotWeatherService {
    @Qualifier("spotWeather")
    private final WebClient spotWeatherWebClient;

    private final TimeZoneService timeZoneService;


    private String getISO8601Time(double latitude, double longitude, int daysToAdd) {
        var timeZone = timeZoneService.getTimeZone(latitude, longitude);
        return TimeUtils.getISO8601Time(daysToAdd, timeZone.block());
    }

    @Cacheable(
            value = "spotWeatherBasic",
            key = "#latitude + ':' + #longitude"
    )
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

    @Cacheable(
            value = "spotWeatherDetailed",
            key = "#latitude + ':' + #longitude"
    )
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

    @Cacheable(
            value = "spotWeatherWindSpeeds",
            key = "#latitude + ':' + #longitude"
    )
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
                        .queryParam("start_hour", getISO8601Time(latitude, longitude, 0))
                        .queryParam("end_hour", getISO8601Time(latitude, longitude, 0))
                        .queryParam("wind_speed_unit", "ms")
                        .build())
                .retrieve()
                .bodyToMono(WeatherApiResponseSchema.class)
                .map(response -> new SpotWeatherWindSpeedsDto(
                        response.hourly().windSpeed1000hPa().getFirst(),
                        response.hourly().windSpeed180m().getFirst(),
                        response.hourly().windSpeed975hPa().getFirst(),
                        response.hourly().windSpeed950hPa().getFirst(),
                        response.hourly().windSpeed925hPa().getFirst(),
                        response.hourly().windSpeed900hPa().getFirst()
                ));
    }

    @Cacheable(
            value = "spotWeatherTimelinePlotData",
            key = "#latitude + ':' + #longitude"
    )
    public Mono<List<SpotWeatherTimelinePlotDataDto>> getSpotWeatherTimelinePlotData(double latitude, double longitude) {
        return spotWeatherWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("latitude", latitude)
                        .queryParam("longitude", longitude)
                        .queryParam("hourly", List.of(
                                "temperature_2m",
                                "weather_code",
                                "precipitation_probability",
                                "is_day"))
                        .queryParam("start_hour", getISO8601Time(latitude, longitude, 0))
                        .queryParam("end_hour", getISO8601Time(latitude, longitude, 3))
                        .build())
                .retrieve()
                .bodyToMono(WeatherApiResponseSchema.class)
                .map(response -> {
                    var spotWeatherTimelinePlotDataDtos = new ArrayList<SpotWeatherTimelinePlotDataDto>();
                    for (int i = 0; i < response.hourly().time().size(); i++) {
                        spotWeatherTimelinePlotDataDtos.add(new SpotWeatherTimelinePlotDataDto(
                                response.hourly().time().get(i),
                                response.hourly().temperature2m().get(i),
                                response.hourly().weatherCode().get(i),
                                response.hourly().precipitationProbability().get(i),
                                response.hourly().isDay().get(i) != 0
                        ));
                    }
                    return spotWeatherTimelinePlotDataDtos;
                });
    }
}
