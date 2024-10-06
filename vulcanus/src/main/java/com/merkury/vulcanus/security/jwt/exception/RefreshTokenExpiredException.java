package com.merkury.vulcanus.security.jwt.exception;

public class RefreshTokenExpiredException extends Exception {
    public RefreshTokenExpiredException() {
        super("Refresh token expired");
    }
}
