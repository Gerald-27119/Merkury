package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SecureDigestAlgorithm;

import javax.crypto.SecretKey;
import java.util.Date;

public class JwtGenerator {

    public String generateToken(String username) {
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + 1000 * 60 * 60 * 10); // 10 hours
        SecureDigestAlgorithm<SecretKey, ?> algorithm = Jwts.SIG.HS256;
        return Jwts
                .builder()
                .subject(username)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(SecretKeyGenerator.generateSecretKey(), algorithm)
                .compact();
    }
}
