package com.merkury.vulcanus.config;

import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

@Configuration
public class TestRestTemplateConfig {

    @Bean
    public RestTemplate testRestTemplate(RestTemplateBuilder builder) {
        return builder
                .errorHandler(new DefaultResponseErrorHandler())
                .requestFactory(() -> new HttpComponentsClientHttpRequestFactory(HttpClients.custom()
                        .disableAutomaticRetries()
                        .useSystemProperties()
                        .build()))
                .build();
    }
}