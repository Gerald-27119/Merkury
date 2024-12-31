package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Date;

import static com.merkury.vulcanus.config.JwtConfig.getKey;
import static com.merkury.vulcanus.config.JwtConfig.getTokenExpiration;

@Component
public class JwtGenerator {

    public String generateToken() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Date issuedAt = new Date();
        Date expiration =  new Date(issuedAt.getTime() + getTokenExpiration());

        var algorithm = Jwts.SIG.HS256;
        return Jwts
                .builder()
                .subject(username)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(getKey(), algorithm)
                .compact();
    }
}