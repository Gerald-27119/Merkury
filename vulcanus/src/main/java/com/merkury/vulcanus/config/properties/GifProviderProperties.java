package com.merkury.vulcanus.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "gif-provider")
public class GifProviderProperties {
    private String apiKey;
    private String url;
}
