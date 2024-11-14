package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;

public class JwtConfig {
    private static final SecretKey KEY = Jwts.SIG.HS256.key().build();
    private static final int TOKEN_COOKIE_EXPIRATION = 60 * 60 * 24 * 7; // 7 days
    private static final String TOKEN_NAME = "JWT_token";
    private static final long TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; //7 days
    private static final long ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

    public static SecretKey getKey() {
        return KEY;
    }

    public static int getTokenCookieExpiration() {
        return TOKEN_COOKIE_EXPIRATION;
    }

    public static String getTokenName() {
        return TOKEN_NAME;
    }

    public static long getTokenExpiration() {
        return TOKEN_EXPIRATION;
    }

    public static long getOneDayInMs() {
        return ONE_DAY_IN_MS;
    }
}
