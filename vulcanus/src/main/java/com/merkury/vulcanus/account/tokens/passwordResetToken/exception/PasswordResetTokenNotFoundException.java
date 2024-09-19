package com.merkury.vulcanus.account.tokens.passwordResetToken.exception;

public class PasswordResetTokenNotFoundException extends RuntimeException {
    public PasswordResetTokenNotFoundException() {super("Token not found");}
}
