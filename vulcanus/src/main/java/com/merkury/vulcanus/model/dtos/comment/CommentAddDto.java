package com.merkury.vulcanus.model.dtos.comment;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record CommentAddDto(@NotBlank(message = "Text cannot be empty.")
                            String text,
                            @Min(value = 0, message = "Rating count cannot be less than 0.")
                            @Max(value = 5, message = "Rating count cannot be more than 5.")
                            Double rating,
                            @NotBlank(message = "SpotId cannot be empty.")
                            @Positive(message = "SpotId must be a positive number.")
                            Long spotId) {
}

