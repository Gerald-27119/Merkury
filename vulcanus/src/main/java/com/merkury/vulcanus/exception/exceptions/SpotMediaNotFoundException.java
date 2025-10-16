package com.merkury.vulcanus.exception.exceptions;

public class SpotMediaNotFoundException extends Exception {
    public SpotMediaNotFoundException(Long spotId, Long mediaId) {
        super(String.format("Media with id: %d in spot with id %d not found", mediaId, spotId));
    }
}
