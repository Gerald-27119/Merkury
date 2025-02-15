package com.merkury.vulcanus.security.jwt;

import com.merkury.vulcanus.config.properties.JwtProperties;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Date;


@Component
@RequiredArgsConstructor
public class JwtGenerator {

    private final JwtProperties jwtProperties;

    public String generateToken() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Date issuedAt = new Date();
        Date expiration =  new Date(issuedAt.getTime() + jwtProperties.getTokenExpiration());

        var algorithm = Jwts.SIG.HS256;
        return Jwts
                .builder()
                .subject(username)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(jwtProperties.getKey(), algorithm)
                .compact();
    }
}