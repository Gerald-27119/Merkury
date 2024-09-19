package com.merkury.vulcanus.account.passwordResetToken.exception;

public class PasswordResetTokenNotFoundException extends RuntimeException {
    public PasswordResetTokenNotFoundException() {super("Token not found");}
}
