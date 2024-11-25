package com.merkury.vulcanus.exception.excpetions;

public class EmailNotSendException extends RuntimeException {
    public EmailNotSendException(String message) {
        super(message);
    }
}
