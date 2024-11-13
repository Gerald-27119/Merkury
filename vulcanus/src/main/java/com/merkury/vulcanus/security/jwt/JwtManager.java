package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;

import static com.merkury.vulcanus.security.jwt.JwtConfig.getKey;

@Component
public class JwtManager {
    private static final int TOKEN_COOKIE_EXPIRATION = 60 * 60 * 24 * 7; // 7 days
    private static final String TOKEN_NAME = "JWT_token";

    public String getUsernameFromJWT(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (ExpiredJwtException e) {
            return e.getClaims().getSubject();
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SignatureException ex) {
            throw new AuthenticationCredentialsNotFoundException("JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted.", ex);
        } catch (Exception ex) {
            throw new AuthenticationCredentialsNotFoundException("JWT was expired or incorrect", ex);
        }
    }

    public Date getExpirationDateFromToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration();
        } catch (ExpiredJwtException e) {
            return e.getClaims().getExpiration();
        }
    }

    public boolean isNotTokenExpired(String token) {
        return !getExpirationDateFromToken(token).before(new Date());
    }

    public void addTokenToCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(TOKEN_NAME, token);
        cookie.setSecure(false);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(TOKEN_COOKIE_EXPIRATION);
        response.addCookie(cookie);
    }

    public String getJWTFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals(TOKEN_NAME))
                .map(Cookie::getValue).
                findFirst()
                .orElse(null);
    }
}
