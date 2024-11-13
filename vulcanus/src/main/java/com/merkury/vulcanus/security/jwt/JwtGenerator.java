package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

import static com.merkury.vulcanus.security.jwt.JwtConfig.getKey;

@Component
public class JwtGenerator {
    private static final long TOKEN_EXPIRATION_TIME_MS = 1000 * 60 * 60 * 24 * 7; //7 days

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date issuedAt = new Date();
        Date expiration =  new Date(issuedAt.getTime() + TOKEN_EXPIRATION_TIME_MS); // 7 days

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