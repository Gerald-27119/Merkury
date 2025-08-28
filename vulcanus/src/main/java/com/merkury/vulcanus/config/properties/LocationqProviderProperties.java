package com.merkury.vulcanus.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "locationq-provider")
public class LocationqProviderProperties {
    private String apiKey;
    private String url;
}
