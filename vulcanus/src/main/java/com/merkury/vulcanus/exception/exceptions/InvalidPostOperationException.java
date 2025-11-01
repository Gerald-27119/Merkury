package com.merkury.vulcanus.exception.exceptions;

public class InvalidPostOperationException extends Exception{
    public InvalidPostOperationException() {
        super("You cannot follow your own post.");
    }
}
