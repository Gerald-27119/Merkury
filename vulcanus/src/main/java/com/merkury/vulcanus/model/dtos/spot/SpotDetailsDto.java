package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.dtos.ImgDto;
import com.merkury.vulcanus.model.dtos.spot.weather.WeatherApiCallCordsDto;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.util.List;
@Builder
public record SpotDetailsDto(@Positive(message = "ID must be a positive number.")
                             Long id,
                             @NotBlank(message = "Name cannot be empty.")
                             String name,
                             @NotBlank(message = "Description cannot be empty.")
                             String description,
                             @Min(value = 0, message = "Rating count cannot be less than 0.")
                             @Max(value = 5, message = "Rating count cannot be more than 5.")
                             Double rating,
                             @Min(value = 0, message = "Views count cannot be less than 0.")
                             Integer viewsCount,
                             @NotEmpty(message = "Photos list cannot be empty.")
                             List<ImgDto> photos,
                             @NotNull(message = "Coordinates cannot be empty.")
                             WeatherApiCallCordsDto weatherApiCallCoords) {
}
