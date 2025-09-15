package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record ForumCategoryDto(@Positive(message = "ID must be a positive number.")
                          Long id,
                               @NotBlank(message = "Name cannot be empty.")
                          String name,
                               @NotBlank(message = "Description cannot be empty.")
                          String description,
                               @NotBlank(message = "Colour cannot be empty.")
                          String colour) {
}
