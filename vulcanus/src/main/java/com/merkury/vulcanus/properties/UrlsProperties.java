package com.merkury.vulcanus.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "url")
@Data
public class UrlsProperties {
    private String afterLoginPageUrl;
    private String githubEmailEndpoint;
}
