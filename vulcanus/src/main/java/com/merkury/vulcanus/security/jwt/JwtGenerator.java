package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

import static com.merkury.vulcanus.security.jwt.JwtConfig.getKey;
import static com.merkury.vulcanus.security.jwt.JwtConfig.getTokenType;
import static com.merkury.vulcanus.security.jwt.TokenType.ACCESS;
import static com.merkury.vulcanus.security.jwt.TokenType.REFRESH;


@Component
public class JwtGenerator {
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + 1000 * 60 * 15); // 15 minutes
        var algorithm = Jwts.SIG.HS256;
        return Jwts
                .builder()
                .subject(username)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .claim(getTokenType(), ACCESS)
                .signWith(getKey(), algorithm)
                .compact();
    }

    public String generateRefreshToken(Authentication authentication) {
        String username = authentication.getName();
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 days
        var algorithm = Jwts.SIG.HS256;
        return Jwts
                .builder()
                .subject(username)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .claim(getTokenType(), REFRESH)
                .signWith(getKey(), algorithm)
                .compact();
    }
}