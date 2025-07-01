package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record ImgDto(
        @Positive(message = "ID must be a positive number.")
        Long id,
        @NotBlank(message = "Img url cannot be empty.")
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
