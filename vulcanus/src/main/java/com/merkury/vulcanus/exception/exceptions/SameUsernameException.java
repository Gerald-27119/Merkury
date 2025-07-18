package com.merkury.vulcanus.exception.exceptions;

public class SameUsernameException extends Exception {
    public SameUsernameException() {
        super("Old username is the same as the new one.");
    }
}
