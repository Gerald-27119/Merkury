package com.merkury.vulcanus.account.excepion.excpetions;

public class EmailNotSendException extends RuntimeException {
    public EmailNotSendException(String message) {
        super(message);
    }
}
