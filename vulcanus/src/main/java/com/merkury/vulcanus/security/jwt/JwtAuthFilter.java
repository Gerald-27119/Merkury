package com.merkury.vulcanus.security.jwt;

import com.merkury.vulcanus.security.CustomUserDetailsService;
import com.merkury.vulcanus.security.jwt.exception.IsNotAccessTokenException;
import com.merkury.vulcanus.security.jwt.exception.RefreshTokenExpiredException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

/**
 *  Throw Forbidden (403)  status code if refresh token is invalid or expired
 *     Throw Unauthorized (401) status code if token isn't access token
 */
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtGenerator tokenGenerator;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtManager jwtManager;


    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String path = request.getRequestURI();

        if (path.equals("/security/refresh")) {
            filterChain.doFilter(request, response);
            return;
        }
        try {
            String token = jwtManager.getJWTFromRequest(request);
            String refreshToken = jwtManager.getJWTFromCookie(request);

            if (StringUtils.hasText(token) && jwtManager.validateToken(token)) {
                validateRefreshToken(refreshToken);
                if (!jwtManager.isAccessToken(token)) {
                    throw new IsNotAccessTokenException();
                }

                String username = jwtManager.getUsernameFromJWT(token);

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                renewRefreshToken(refreshToken, response, authenticationToken);
            }
            filterChain.doFilter(request, response);
        } catch (IsNotAccessTokenException | RefreshTokenExpiredException e) {
            handleJwtException(response, e);
        }
    }

    private void validateRefreshToken(String refreshToken) throws RefreshTokenExpiredException {
        try {
            jwtManager.validateToken(refreshToken);
        } catch (AuthenticationCredentialsNotFoundException e) {
            throw new RefreshTokenExpiredException();
        }
    }

    private void renewRefreshToken(
            String refreshToken,
            HttpServletResponse response,
            UsernamePasswordAuthenticationToken authenticationToken
    ) {
        if (StringUtils.hasText(refreshToken) && !jwtManager.isTokenExpired(refreshToken)) {
            Date tokenExpirationDate = jwtManager.getExpirationDateFromToken(refreshToken);
            long timeUntilExpired = tokenExpirationDate.getTime() - new Date().getTime();
            long oneDayInMilliSeconds = 1000 * 60 * 60 * 24;
            if (timeUntilExpired <= oneDayInMilliSeconds) {
                String newToken = tokenGenerator.generateRefreshToken(authenticationToken);
                jwtManager.addTokenToCookie(response, newToken);
            }
        }
    }

    private void handleJwtException(HttpServletResponse response, Exception e) throws IOException {
        if (e instanceof RefreshTokenExpiredException) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        }else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
        response.setContentType("application/json");
        response.getWriter().write(e.getMessage());
        response.getWriter().flush();
    }
}
