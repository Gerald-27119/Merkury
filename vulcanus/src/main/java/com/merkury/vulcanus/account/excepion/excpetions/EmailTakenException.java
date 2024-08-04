package com.merkury.vulcanus.account.excepion.excpetions;

public class EmailTakenException extends Exception {
    public EmailTakenException() {
        super("Email taken");
    }
}
