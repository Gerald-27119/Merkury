package com.merkury.vulcanus.model.dtos.coment;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record CommentDto(@Positive(message = "ID must be a positive number.")
                         Long id,
                         @NotBlank(message = "Text cannot be empty.")
                         String text,
                         @Positive(message = "Rating must be a positive number.")
                         @Min(value = 0, message = "Rating cannot be less than 0.")
                         Double rating,
                         @Positive(message = "Likes must be a positive number.")
                         @Min(value = 0, message = "Likes cannot be less than 0.")
                         Integer likes,
                         @PastOrPresent(message = "PublishDate must be in the past or present.")
                         @NotNull(message = "PublishDate cannot be null.")
                         LocalDateTime publishDate,
                         @NotBlank(message = "Author cannot be empty.")
                         String author) {
}
