package com.merkury.vulcanus.security.jwt.refresh.service;

import com.merkury.vulcanus.security.CustomUserDetailsService;
import com.merkury.vulcanus.security.jwt.JwtGenerator;
import com.merkury.vulcanus.security.jwt.JwtManager;
import com.merkury.vulcanus.security.jwt.exception.IsNotAccessTokenException;
import com.merkury.vulcanus.security.jwt.exception.RefreshTokenExpiredException;
import com.merkury.vulcanus.security.jwt.exception.UsernameIsNotIdenticalException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import static com.merkury.vulcanus.security.jwt.TokenType.ACCESS;
import static com.merkury.vulcanus.security.jwt.TokenType.REFRESH;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtGenerator tokenGenerator;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtManager jwtManager;

    public void refreshAccessToken(HttpServletRequest request, HttpServletResponse response)
            throws UsernameIsNotIdenticalException, RefreshTokenExpiredException, IsNotAccessTokenException {
        var refreshToken = jwtManager.getJWTFromCookie(request, REFRESH);
        var accessToken = jwtManager.getJWTFromCookie(request, ACCESS);

        if (StringUtils.hasText(refreshToken) && jwtManager.validateToken(refreshToken)) {
            if (!jwtManager.isAccessToken(accessToken)) {
                throw new IsNotAccessTokenException();
            }
            if (!jwtManager.isTokenExpired(accessToken)) {
                jwtManager.addTokenToCookie(response, accessToken, ACCESS);
                return;
            }
            String username = jwtManager.getUsernameFromJWT(accessToken);
            String usernameFromRefreshToken = jwtManager.getUsernameFromJWT(refreshToken);

            if (!username.equals(usernameFromRefreshToken)) {
                throw new UsernameIsNotIdenticalException();
            }

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            var newAccessToken = tokenGenerator.generateToken(authenticationToken, ACCESS);
            jwtManager.addTokenToCookie(response, newAccessToken, ACCESS);
            return;
        }
        throw new RefreshTokenExpiredException();
    }
}
