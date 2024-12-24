package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import io.jsonwebtoken.Jwts;
import org.springframework.test.context.ActiveProfiles;

import static com.merkury.vulcanus.config.JwtConfig.getKey;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class JwtGeneratorTest {

    @Autowired
    private JwtGenerator jwtGenerator;

    @WithMockUser
    @Test
    void generateToken() {
        String token = jwtGenerator.generateToken();

        Claims claims = Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        assertAll(
                () -> assertNotNull(token, "Token should not be null"),
                () -> assertEquals("user", claims.getSubject(), "Username in token should match 'testUser'"),
                () -> assertNotNull(claims.getIssuedAt(), "IssuedAt should not be null"),
                () -> assertNotNull(claims.getExpiration(), "Expiration should not be null"),
                () -> assertTrue(claims.getExpiration().after(claims.getIssuedAt()), "Expiration should be after IssuedAt")
        );
    }
}
