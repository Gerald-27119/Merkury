package com.merkury.vulcanus.model.dtos.spot;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.serializers.border.point.BorderPointJsonDeserializer;
import com.merkury.vulcanus.model.serializers.border.point.BorderPointJsonSerializer;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.util.List;
@Builder
public record GeneralSpotDto(@Positive(message = "ID must be a positive number.")
                             Long id,
                             @NotBlank(message = "Area color cannot be empty.")
                             String areaColor,
                             @NotBlank(message = "Name cannot be empty.")
                             String name,
                             @Min(value = 0, message = "Rating count cannot be less than 0.")
                             @Max(value = 5, message = "Rating count cannot be more than 5.")
                             Double rating,
                             @NotEmpty(message = "Contour coordinates list cannot be empty.")
                             List<Double[]> contourCoordinates,
                             @JsonSerialize(using = BorderPointJsonSerializer.class)
                             @JsonDeserialize(using = BorderPointJsonDeserializer.class)
                             @NotNull(message = "Center point cannot be null.")
                             BorderPoint centerPoint,
                             @Positive(message = "Area must be greater than 0.")
                             Double area) {
}
