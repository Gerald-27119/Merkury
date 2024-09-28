package com.merkury.vulcanus.security.jwt.exception;


import org.springframework.security.core.AuthenticationException;

public class IsNotAccessTokenException extends AuthenticationException {
    public IsNotAccessTokenException() {
        super("This is not an access token");
    }
}
