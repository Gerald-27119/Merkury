package com.merkury.vulcanus.exception.excpetions;

public class PasswordResetTokenNotFoundException extends Exception {
    public PasswordResetTokenNotFoundException() {super("Token not found");}
}
