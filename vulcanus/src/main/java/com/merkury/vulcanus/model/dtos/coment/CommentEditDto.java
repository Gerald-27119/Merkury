package com.merkury.vulcanus.model.dtos.coment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CommentEditDto(@NotBlank(message = "Text cannot be empty.")
                             String text,
                             @NotBlank(message = "CommentId cannot be empty.")
                             @Positive(message = "CommentId must be a positive number.")
                             Long commentId) {
}

