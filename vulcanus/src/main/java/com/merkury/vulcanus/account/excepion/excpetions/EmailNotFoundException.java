package com.merkury.vulcanus.account.excepion.excpetions;

public class EmailNotFoundException extends Exception {
    public EmailNotFoundException() {
        super("Email not found!");
    }
}
