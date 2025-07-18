package com.merkury.vulcanus.exception.exceptions;

public class ExternalProviderAccountException extends Exception {
    public ExternalProviderAccountException() {
        super("Operation not allowed for accounts linked to an external provider.");
    }
}
