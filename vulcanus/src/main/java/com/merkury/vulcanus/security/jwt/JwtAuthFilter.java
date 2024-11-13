package com.merkury.vulcanus.security.jwt;

import com.merkury.vulcanus.security.CustomUserDetailsService;
import com.merkury.vulcanus.security.jwt.exception.TokenExpiredException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

/**
 * Throw Forbidden (403)  status code if token is invalid or expired
 */
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtGenerator tokenGenerator;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtManager jwtManager;
    private static final long ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;


    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String token = jwtManager.getJWTFromCookie(request);
        if (StringUtils.hasText(token) && jwtManager.validateToken(token)) {
            String username = jwtManager.getUsernameFromJWT(token);

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            renewRefreshToken(token, response, authenticationToken);
        }
        filterChain.doFilter(request, response);
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
                String newToken = tokenGenerator.generateToken(authenticationToken);
                jwtManager.addTokenToCookie(response, newToken);
            }
        }
    }

    private void handleJwtException(HttpServletResponse response, Exception e) throws IOException {
        if (e instanceof TokenExpiredException) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
        response.setContentType("application/json");
        response.getWriter().write(e.getMessage());
        response.getWriter().flush();
    }
}
