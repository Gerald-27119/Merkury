package com.merkury.vulcanus.model.dtos.coment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CommentAddDto(@NotBlank(message = "Text cannot be empty.")
                            String text,
                            @NotBlank(message = "SpotId cannot be empty.")
                            @Positive(message = "SpotId must be a positive number.")
                            Long spotId) {
}

