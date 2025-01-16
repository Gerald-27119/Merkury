package com.merkury.vulcanus.model.dtos.spot;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record GeneralSpotDto(@Positive(message = "ID must be a positive number.")
                             Long id,
                             @NotBlank(message = "Area color cannot be empty.")
                             String areaColor,
                             @NotBlank(message = "Name cannot be empty.")
                             String name,
                             @Positive(message = "Rating must be a positive number.")
                             @Min(value = 0, message = "Rating cannot be less than 0.")
                             Double rating,
                             @NotEmpty(message = "Contour coordinates list cannot be empty.")
                             List<Double[]> contourCoordinates) {
}
