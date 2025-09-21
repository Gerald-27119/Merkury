package com.merkury.vulcanus.features.spot;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class SpotWeatherService {
    @Qualifier("spotWeather")
    private final WebClient weatherWebClient;
}
