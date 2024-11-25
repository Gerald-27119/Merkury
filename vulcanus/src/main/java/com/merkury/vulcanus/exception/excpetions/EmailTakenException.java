package com.merkury.vulcanus.exception.excpetions;

public class EmailTakenException extends Exception {
    public EmailTakenException() {
        super("Email taken");
    }
}
