package com.merkury.vulcanus.account.password.reset.token.exception;

public class PasswordResetTokenNotFoundException extends Exception {
    public PasswordResetTokenNotFoundException() {super("Token not found");}
}
