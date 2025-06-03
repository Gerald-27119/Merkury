package com.merkury.vulcanus.model.dtos.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record SpotCommentPhotoDto(
        @Positive(message = "ID must be a positive number.")
        Long id,
        @NotBlank(message = "Url cannot be empty.")
        String url
) {
}
