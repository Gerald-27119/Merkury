package com.merkury.vulcanus.exception.exceptions;

public class SpotNotFoundException extends RuntimeException {
    public SpotNotFoundException(Long id) {
        super(String.format("Spot with id: %d, not found", id));
    }
}
