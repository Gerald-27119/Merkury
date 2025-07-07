package com.merkury.vulcanus.exception.exceptions;

public class SameEmailException extends Exception {
    public SameEmailException() {
        super("Old email is the same as the new one.");
    }
}
