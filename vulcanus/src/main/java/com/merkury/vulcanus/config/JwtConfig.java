package com.merkury.vulcanus.config;

import com.merkury.vulcanus.config.properties.JwtProperties;
import io.jsonwebtoken.Jwts;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Bean
    public JwtProperties jwtProperties() {
        return new JwtProperties(Jwts.SIG.HS256.key().build());
    }
}
