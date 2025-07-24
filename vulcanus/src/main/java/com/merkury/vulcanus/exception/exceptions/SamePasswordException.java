package com.merkury.vulcanus.exception.exceptions;

public class SamePasswordException extends Exception {
    public SamePasswordException() {
        super("Old password is the same as the new one.");
    }
}
