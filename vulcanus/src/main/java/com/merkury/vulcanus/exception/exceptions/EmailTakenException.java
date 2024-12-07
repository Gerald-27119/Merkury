package com.merkury.vulcanus.exception.exceptions;

public class EmailTakenException extends Exception {
    public EmailTakenException() {
        super("Email taken");
    }
}
