package com.merkury.vulcanus.config;

import com.merkury.vulcanus.config.properties.CoordinatesTimeZoneProperties;
import com.merkury.vulcanus.config.properties.GifProviderProperties;
import com.merkury.vulcanus.config.properties.LocationqProviderProperties;
import com.merkury.vulcanus.config.properties.SpotWeatherProviderProperties;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class WebClientConfig {

    @Bean
    public WebClient webClient(OAuth2AuthorizedClientManager authorizedClientManager) {
        var oauth2Client =
                new ServletOAuth2AuthorizedClientExchangeFilterFunction(authorizedClientManager);
        return WebClient.builder()
                .apply(oauth2Client.oauth2Configuration())
                .build();
    }

    @Bean
    @Qualifier("tenorClient")
    public WebClient tenorWebClient(WebClient.Builder builder, GifProviderProperties props) {
        return builder
                .baseUrl(props.getUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Bean
    @Qualifier("locationq")
    public WebClient locationqWebClient(LocationqProviderProperties props) {
        return WebClient.builder()
                .baseUrl(props.getUrl())
                .build();
    }

    @Bean
    @Qualifier("spotWeather")
    public WebClient spotWeatherWebClient(WebClient.Builder builder, SpotWeatherProviderProperties props) {
        return builder
                .baseUrl(props.getUrl())
                .build();
    }

    @Bean
    @Qualifier("coordinatesTimeZone")
    public WebClient coordinatesTimeZoneWebClient(WebClient.Builder builder, CoordinatesTimeZoneProperties props) {
        return builder
                .baseUrl(props.getUrl())
                .build();
    }
}
