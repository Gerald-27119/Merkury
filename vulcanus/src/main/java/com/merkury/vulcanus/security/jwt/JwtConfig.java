package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;

public class JwtConfig {
    private static final SecretKey key = Jwts.SIG.HS256.key().build();

    public static SecretKey getKey() {
        return key;
    }
}
