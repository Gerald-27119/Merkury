package com.merkury.vulcanus.security.jwt.exception;

public class IsNotAccessTokenException extends Exception {
    public IsNotAccessTokenException() {
        super("Token is not access token");
    }
}
