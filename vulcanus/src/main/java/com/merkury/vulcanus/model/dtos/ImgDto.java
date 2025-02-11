package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ImgDto(@NotBlank(message = "Img url cannot be empty.")
                     String img,
                     @NotBlank(message = "Title cannot be empty.")
                     String title,
                     @NotBlank(message = "Description cannot be empty.")
                     String description,
                     @Min(value = 0, message = "Likes cannot be less than 0.")
                     Integer likes,
                     @Min(value = 0, message = "Views count cannot be less than 0.")
                     Integer views,
                     @NotBlank(message = "Author cannot be empty.")
                     String author) {
}
