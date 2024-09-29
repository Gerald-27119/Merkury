package com.merkury.vulcanus.security.jwt.exception;

public class UsernameIsNotIdenticalException extends Exception {
    public UsernameIsNotIdenticalException() {
        super("Username from token and refresh token are not the same");
    }
}
