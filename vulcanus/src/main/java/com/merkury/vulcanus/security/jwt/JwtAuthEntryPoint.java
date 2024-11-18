package com.merkury.vulcanus.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;

@Slf4j
@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        log.error(Arrays.toString(authException.getStackTrace()));
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Message: " + authException.getMessage());
        response.getWriter().write("\nCause: " + authException.getCause());
    }
}