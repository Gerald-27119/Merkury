package com.merkury.vulcanus.security.jwt.refresh.service;

import com.merkury.vulcanus.security.CustomUserDetailsService;
import com.merkury.vulcanus.security.jwt.JwtGenerator;
import com.merkury.vulcanus.security.jwt.JwtManager;
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

    public String refreshAccessToken(HttpServletRequest request) {
        var refreshToken = jwtManager.getJWTFromCookie(request);
        var token = jwtManager.getJWTFromRequest(request);

        if (StringUtils.hasText(refreshToken) && jwtManager.validateToken(refreshToken)) {
            String username = jwtManager.getUsernameFromJWT(token);
            String usernameFromRefreshToken = jwtManager.getUsernameFromJWT(refreshToken);

            if (!username.equals(usernameFromRefreshToken)) {
                return null;
            }

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            return tokenGenerator.generateToken(authenticationToken);
        }
        return null;
    }
}
