package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record CategoryDto(@NotBlank(message = "Name cannot be empty.")
                          String name,
                          @NotBlank(message = "Description cannot be empty.")
                          String description,
                          @NotBlank(message = "Colour cannot be empty.")
                          String colour) {
}
