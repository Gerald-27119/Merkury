package com.merkury.vulcanus.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "spot-weather")
public class SpotWeatherProviderProperties {
    private String url;
}
