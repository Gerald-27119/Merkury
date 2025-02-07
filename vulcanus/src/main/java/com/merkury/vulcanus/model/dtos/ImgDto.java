package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record ImgDto(@NotBlank(message = "Img url cannot be empty.")
                     String img,
                     @NotBlank(message = "Title cannot be empty.")
                     String title,
                     @NotBlank(message = "Description cannot be empty.")
                     String description,
                     @Positive(message = "Likes must be a positive number.")
                     @Min(value = 0, message = "Likes cannot be less than 0.")
                     Integer likes,
                     @Positive(message = "Views count must be a positive number.")
                     @Min(value = 0, message = "Views count cannot be less than 0.")
                     Integer views,
                     @NotBlank(message = "Author cannot be empty.")
                     String author) {
}
