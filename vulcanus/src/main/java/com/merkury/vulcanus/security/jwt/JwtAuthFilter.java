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

import static com.merkury.vulcanus.security.jwt.TokenType.ACCESS;
import static com.merkury.vulcanus.security.jwt.TokenType.REFRESH;

/**
 *  Throw Forbidden (403)  status code if refresh token is invalid or expired
 *     Throw Unauthorized (401) status code if token isn't access token
 */
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtGenerator tokenGenerator;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtManager jwtManager;
    private final long ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;


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
            String accessToken = jwtManager.getJWTFromCookie(request, ACCESS);
            String refreshToken = jwtManager.getJWTFromCookie(request, REFRESH);

            if (StringUtils.hasText(accessToken) && jwtManager.validateToken(accessToken)) {
                validateRefreshToken(refreshToken);
                if (jwtManager.isNotAccessToken(accessToken)) {
                    throw new IsNotAccessTokenException();
                }

                String username = jwtManager.getUsernameFromJWT(accessToken);

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
        if (StringUtils.hasText(refreshToken) && jwtManager.isNotTokenExpired(refreshToken)) {
            Date tokenExpirationDate = jwtManager.getExpirationDateFromToken(refreshToken);
            long timeUntilExpired = tokenExpirationDate.getTime() - new Date().getTime();
            if (timeUntilExpired <= ONE_DAY_IN_MILLISECONDS) {
                String newToken = tokenGenerator.generateToken(authenticationToken, REFRESH);
                jwtManager.addTokenToCookie(response, newToken, REFRESH);
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
