package com.merkury.vulcanus.security.jwt;

import com.merkury.vulcanus.security.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

import static com.merkury.vulcanus.security.jwt.JwtConfig.getOneDayInMs;

/**
 * Throw Forbidden (401) status code if token is invalid or expired
 */
@Slf4j
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
        if (request.getRequestURI().equals("/account/login")) {
            filterChain.doFilter(request, response);
            log.debug("This path is not use JWT.");
            return;
        }
        try {
            String token = jwtManager.getJWTFromCookie(request);
            jwtManager.validateToken(token);

            String username = jwtManager.getUsernameFromJWT(token);

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            renewRefreshToken(token, response, authenticationToken);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            handleJwtException(response, e);
        }
    }

    private void renewRefreshToken(
            String token,
            HttpServletResponse response,
            UsernamePasswordAuthenticationToken authenticationToken
    ) {
        if (jwtManager.isNotTokenExpired(token)) {
            Date tokenExpirationDate = jwtManager.getExpirationDateFromToken(token);
            long timeUntilExpired = tokenExpirationDate.getTime() - new Date().getTime();
            if (timeUntilExpired <= getOneDayInMs()) {
                String newToken = tokenGenerator.generateToken(authenticationToken);
                jwtManager.addTokenToCookie(response, newToken);
            }
        }
    }

    private void handleJwtException(HttpServletResponse response, Exception e) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(e.getMessage());
        response.getWriter().flush();
    }
}
