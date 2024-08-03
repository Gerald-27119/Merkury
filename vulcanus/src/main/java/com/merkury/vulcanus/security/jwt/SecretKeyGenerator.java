package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;

public class SecretKeyGenerator {

    public static SecretKey generateSecretKey() {
        return Jwts.SIG.HS256.key().build();
    }
}
