package com.merkury.vulcanus.exception.exceptions;

public class InvalidProviderException extends Exception {
    public InvalidProviderException(String provider) {
        super("Invalid provider:" +
                provider);
    }
}
