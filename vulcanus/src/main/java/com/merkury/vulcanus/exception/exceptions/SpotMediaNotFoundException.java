package com.merkury.vulcanus.exception.exceptions;

import com.merkury.vulcanus.model.enums.GenericMediaType;

public class SpotMediaNotFoundException extends Exception {
    public SpotMediaNotFoundException(Long spotId, Long mediaId, GenericMediaType mediaType) {
        super(String.format("Media with id: %d in spot with id %d as %s not found", mediaId, spotId, mediaType));
    }
}
