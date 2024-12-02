package com.merkury.vulcanus.exception;


import org.springframework.security.core.AuthenticationException;

public class JwtValidationException extends AuthenticationException {
    public JwtValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}