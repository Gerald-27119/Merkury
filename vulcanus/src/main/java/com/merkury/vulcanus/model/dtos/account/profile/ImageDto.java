package com.merkury.vulcanus.model.dtos.account.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record ImageDto(@NotBlank(message = "Src cannot be empty.")
                       String src,
                       @Positive(message = "HeartCount must be a positive number.")
                       Integer heartsCount,
                       @Positive(message = "ViewsCount must be a positive number.")
                       Integer viewsCount,
                       @NotBlank(message = "Title cannot be empty.")
                       String title,
                       @Positive(message = "Id must be a positive number.")
                       Long id) {
}
