package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.dtos.spot.coordinates.SpotCoordinatesDto;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.util.List;
import java.util.Set;

@Builder
public record SpotDetailsDto(@Positive(message = "ID must be a positive number.")
                             Long id,
                             @NotBlank(message = "Name cannot be empty.")
                             String name,
                             @NotBlank(message = "Country cannot be empty.")
                             String country,
                             @NotBlank(message = "City cannot be empty.")
                             String city,
                             @NotBlank(message = "Street cannot be empty.")
                             String street,
                             @NotBlank(message = "Description cannot be empty.")
                             String description,
                             @Min(value = 0, message = "Rating count cannot be less than 0.")
                             @Max(value = 5, message = "Rating count cannot be more than 5.")
                             Double rating,
                             @Min(value = 0, message = "Rating count cannot be less than 0.")
                             Integer ratingCount,
                             @NotEmpty(message = "Media list cannot be empty.")
                             List<SpotMediaDto> media,
                             @NotNull(message = "Coordinates cannot be empty.")
                             SpotCoordinatesDto weatherApiCallCoords,
                             Set<SpotTagDto> tags) {
}
