package com.merkury.vulcanus.model.dtos.comment;

import jakarta.validation.constraints.*;

public record CommentEditDto(@NotBlank(message = "Text cannot be empty.")
                             @Size(max = 300, message = "Text cannot exceed 300 characters.")
                             String text,
                             @Min(value = 0, message = "Rating count cannot be less than 0.")
                             @Max(value = 5, message = "Rating count cannot be more than 5.")
                             Double rating) {
}

