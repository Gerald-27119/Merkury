package com.merkury.vulcanus.exception.exceptions;

public class SpotCommentRatingOutOfBoundariesException extends Exception {
    public SpotCommentRatingOutOfBoundariesException() {
        super("Spot comment rating must be between 0 and 5.");
    }
}
