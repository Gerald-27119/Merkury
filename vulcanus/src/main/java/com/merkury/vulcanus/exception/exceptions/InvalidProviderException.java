package com.merkury.vulcanus.exception.exceptions;

public class InvalidProviderException extends Exception {
    public InvalidProviderException(String provider) {
        super("Account was created using an external provider (" + provider + "). " +
                "To change your password, please do so through your original authentication provider.");
    }
}
