package com.merkury.vulcanus.exception.excpetions;

import org.springframework.security.core.AuthenticationException;

public class JwtValidationException extends AuthenticationException {
    public JwtValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}