package com.merkury.vulcanus.email.exception.exceptions;

public class EmailNotSendException extends RuntimeException {
    public EmailNotSendException(String message) {
        super(message);
    }
}
