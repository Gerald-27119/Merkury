package com.merkury.vulcanus.account.passwordResetToken.exception;

public class PasswordResetTokenIsInvalidException extends RuntimeException{
    public PasswordResetTokenIsInvalidException() {super("Token Invalid");}
}
