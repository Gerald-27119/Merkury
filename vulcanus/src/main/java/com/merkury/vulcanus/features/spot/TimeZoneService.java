package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.model.dtos.spot.weather.api.response.TimeZoneApiResponseSchema;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class TimeZoneService {
    @Qualifier("coordinatesTimeZone")
    private final WebClient coordinatesTimeZoneWebClient;

    public Mono<String> getTimeZone(double latitude, double longitude) {
        return coordinatesTimeZoneWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/" + latitude + "," + longitude)
                        .build())
                .retrieve()
                .bodyToMono(TimeZoneApiResponseSchema.class)
                .map(TimeZoneApiResponseSchema::timezoneId);
    }
}
