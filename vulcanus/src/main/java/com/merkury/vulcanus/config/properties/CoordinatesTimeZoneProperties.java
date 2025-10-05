package com.merkury.vulcanus.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "coordinates-time-zone")
public class CoordinatesTimeZoneProperties {
    private String url;
}
