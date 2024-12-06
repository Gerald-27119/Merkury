package com.merkury.vulcanus.security.jwt;

import com.merkury.vulcanus.exception.excpetions.JwtValidationException;
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

import static com.merkury.vulcanus.config.JwtConfig.getKey;
import static com.merkury.vulcanus.config.JwtConfig.getTokenCookieExpiration;
import static com.merkury.vulcanus.config.JwtConfig.getTokenName;

@Component
public class JwtManager {
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

    public void validateToken(String token) {
        if (token == null || token.isBlank()) {
            throw new AuthenticationCredentialsNotFoundException("JWT is null or empty. code: 401");
        }
        try {
            Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token);
        } catch (SignatureException ex) {
            throw new JwtValidationException("JWT signature does not match locally computed signature.", ex);
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
        Cookie cookie = new Cookie(getTokenName(), token);
        cookie.setSecure(false);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(getTokenCookieExpiration());
        response.addCookie(cookie);
    }

    public String getJWTFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals(getTokenName()))
                .map(Cookie::getValue).
                findFirst()
                .orElse(null);
    }
}
