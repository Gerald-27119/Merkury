package com.merkury.vulcanus.security.jwt;

import io.jsonwebtoken.Claims;
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
import static com.merkury.vulcanus.security.jwt.JwtConfig.getTokenType;
import static com.merkury.vulcanus.security.jwt.TokenType.REFRESH;

@Component
public class JwtManager {
    private static final int REFRESH_TOKEN_COOKIE_EXPIRATION = 60 * 60 * 24 * 7; // 7 days
    private static final int ACCESS_TOKEN_COOKIE_EXPIRATION = 60 * 15; // 15 minutes

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

    public void addTokenToCookie(HttpServletResponse response, String token, TokenType tokenType) {
        int expiration = ACCESS_TOKEN_COOKIE_EXPIRATION;
        if (tokenType == REFRESH) {
            expiration = REFRESH_TOKEN_COOKIE_EXPIRATION;
        }
        Cookie cookie = new Cookie(tokenType.getCookieName(), token);
        cookie.setSecure(false);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(expiration);
        response.addCookie(cookie);


    }

    public boolean isNotAccessToken(String token) {
        try {
            Claims claims = Jwts
                    .parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return !claims.get(getTokenType()).equals("ACCESS");
        } catch (ExpiredJwtException e) {
            return !e.getClaims().get(getTokenType()).equals("ACCESS");
        }
    }

    public String getJWTFromCookie(HttpServletRequest request, TokenType tokenType) {
        if (request.getCookies() == null) {
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals(tokenType.getCookieName()))
                .map(Cookie::getValue).
                findFirst()
                .orElse(null);
    }
}
