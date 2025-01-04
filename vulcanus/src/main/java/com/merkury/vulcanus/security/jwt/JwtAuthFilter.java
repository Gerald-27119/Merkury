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
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

import static com.merkury.vulcanus.config.JwtConfig.getOneDayInMs;


@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtGenerator tokenGenerator;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtManager jwtManager;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String token = jwtManager.getJWTFromCookie(request);
        try {
            jwtManager.validateToken(token);
        } catch (Exception e) {
            log.error("Unauthorized access error: {}", e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            String responseBody = String.format(
                    "{ \"message\": \"Unauthorized access\", \"error\": \"%s\" }",
                    e.getMessage()
            );
            response.getWriter().write(responseBody);

            response.getWriter().flush();
            response.getWriter().close();
            return;
        }
        String identifier = jwtManager.getUsernameFromJWT(token);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(identifier);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        renewToken(token, response);
        filterChain.doFilter(request, response);
    }

    private void renewToken(
            String token,
            HttpServletResponse response
    ) {
        if (jwtManager.isNotTokenExpired(token)) {
            Date tokenExpirationDate = jwtManager.getExpirationDateFromToken(token);
            long timeUntilExpired = tokenExpirationDate.getTime() - new Date().getTime();
            if (timeUntilExpired <= getOneDayInMs()) {
                jwtManager.addTokenToCookie(response, tokenGenerator.generateToken());
            }
        }
    }
}

