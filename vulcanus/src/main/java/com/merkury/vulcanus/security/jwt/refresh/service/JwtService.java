package com.merkury.vulcanus.security.jwt.refresh.service;

import com.merkury.vulcanus.security.CustomUserDetailsService;
import com.merkury.vulcanus.security.jwt.JwtGenerator;
import com.merkury.vulcanus.security.jwt.JwtManager;
import com.merkury.vulcanus.security.jwt.exception.RefreshTokenExpiredException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtGenerator tokenGenerator;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtManager jwtManager;

    public String refreshAccessToken(HttpServletRequest request) throws RefreshTokenExpiredException {
        var refreshToken = jwtManager.getJWTFromCookie(request);
        var token = jwtManager.getJWTFromRequest(request);

        if (StringUtils.hasText(refreshToken) && jwtManager.validateToken(refreshToken)) {
            if (!jwtManager.isAccessToken(token)) {
                throw new JwtException("Token is not access token");
            }
            if (!jwtManager.isTokenExpired(token)) {
                return token;
            }
            String username = jwtManager.getUsernameFromJWT(token);
            String usernameFromRefreshToken = jwtManager.getUsernameFromJWT(refreshToken);

            if (!username.equals(usernameFromRefreshToken)) {
                throw new JwtException("Username from token and refresh token are not the same");
            }

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            return tokenGenerator.generateToken(authenticationToken);
        }
        throw new RefreshTokenExpiredException();
    }
}
