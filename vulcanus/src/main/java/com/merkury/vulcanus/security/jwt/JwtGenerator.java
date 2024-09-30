package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

import static com.merkury.vulcanus.security.jwt.JwtConfig.getKey;
import static com.merkury.vulcanus.security.jwt.JwtConfig.getTokenType;
import static com.merkury.vulcanus.security.jwt.TokenType.REFRESH;


@Component
public class JwtGenerator {
    private static final long ACCESS_TOKEN_EXPIRATION_TIME_MS = 1000 * 60 * 15; // 15 minutes
    private static final long REFRESH_TOKEN_EXPIRATION_TIME_MS = 1000 * 60 * 60 * 24 * 7; //7 days

    public String generateToken(Authentication authentication, TokenType tokenType) {
        String username = authentication.getName();
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + ACCESS_TOKEN_EXPIRATION_TIME_MS); // 15 minutes
        if (tokenType == REFRESH) {
            expiration = new Date(issuedAt.getTime() + REFRESH_TOKEN_EXPIRATION_TIME_MS); // 7 days
        }
        var algorithm = Jwts.SIG.HS256;
        return Jwts
                .builder()
                .subject(username)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .claim(getTokenType(), tokenType)
                .signWith(getKey(), algorithm)
                .compact();
    }
}