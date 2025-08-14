package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.embeddable.BorderPoint;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;
@Builder
public record GeneralSpotDto(@Positive(message = "ID must be a positive number.")
                             Long id,
                             @NotBlank(message = "Area color cannot be empty.")
                             String areaColor,
                             @NotBlank(message = "Name cannot be empty.")
                             String name,
                             @NotBlank(message = "Region cannot be empty.")
                             String region,
                             @Min(value = 0, message = "Rating count cannot be less than 0.")
                             @Max(value = 5, message = "Rating count cannot be more than 5.")
                             Double rating,
                             @NotEmpty(message = "Contour coordinates list cannot be empty.")
                             List<Double[]> contourCoordinates,
                             @NotNull(message = "Center point cannot be null.")
                             BorderPoint centerPoint,
                             @Positive(message = "Area must be greater than 0.")
                             Double area) implements Serializable {
    @Serial
    private static final long serialVersionUID = -834173824086631493L;
}
