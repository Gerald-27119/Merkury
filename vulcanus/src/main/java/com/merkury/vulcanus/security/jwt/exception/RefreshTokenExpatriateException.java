package com.merkury.vulcanus.security.jwt.exception;

import org.springframework.security.core.AuthenticationException;

public class RefreshTokenExpatriateException extends AuthenticationException {
    public RefreshTokenExpatriateException() {
        super("Refresh token has expired");
    }
}
