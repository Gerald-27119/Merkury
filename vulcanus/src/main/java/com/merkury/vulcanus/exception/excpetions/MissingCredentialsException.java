package com.merkury.vulcanus.exception.excpetions;

public class MissingCredentialsException extends RuntimeException {
    public MissingCredentialsException(String message) {
        super(message);
    }
}
