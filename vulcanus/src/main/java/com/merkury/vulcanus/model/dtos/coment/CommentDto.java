package com.merkury.vulcanus.model.dtos.coment;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record CommentDto(@Positive(message = "ID must be a positive number.")
                         Long id,
                         @NotBlank(message = "Text cannot be empty.")
                         String text,
                         @Min(value = 1, message = "Rating count cannot be less than 1.")
                         @Max(value = 5, message = "Rating count cannot be more than 5.")
                         Double rating,
                         @Min(value = 0, message = "Likes cannot be less than 0.")
                         Integer likes,
                         @PastOrPresent(message = "PublishDate must be in the past or present.")
                         @NotNull(message = "PublishDate cannot be null.")
                         LocalDateTime publishDate,
                         @NotBlank(message = "Author cannot be empty.")
                         String author) {
}
