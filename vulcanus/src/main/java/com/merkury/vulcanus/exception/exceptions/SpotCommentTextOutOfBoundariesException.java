package com.merkury.vulcanus.exception.exceptions;

public class SpotCommentTextOutOfBoundariesException extends Exception {
    public SpotCommentTextOutOfBoundariesException() {
        super("Spot comment text must be between 1 and 1000 characters");
    }
}
