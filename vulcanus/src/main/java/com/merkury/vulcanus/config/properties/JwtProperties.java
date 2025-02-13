package com.merkury.vulcanus.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import javax.crypto.SecretKey;

@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {
    private SecretKey key;
    private int tokenCookieExpiration;
    private String tokenName;
    private long tokenExpiration;
    private long oneDayInMs;

    public JwtProperties(SecretKey key) {
        this.key = key;
    }
}
