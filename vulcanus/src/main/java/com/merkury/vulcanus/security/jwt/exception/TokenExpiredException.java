package com.merkury.vulcanus.security.jwt.exception;

public class TokenExpiredException extends Exception {
    public TokenExpiredException() {
        super("Refresh token expired");
    }
}
