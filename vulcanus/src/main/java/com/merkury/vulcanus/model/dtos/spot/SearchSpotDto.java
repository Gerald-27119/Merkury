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
import java.util.Set;

@Builder
public record SearchSpotDto(@Positive(message = "ID must be a positive number.")
                            Long id,
                            @NotBlank(message = "Name cannot be empty.")
                            String name,
                            @Min(value = 0, message = "Rating cannot be less than 0.")
                            @Max(value = 5, message = "Rating cannot be more than 5.")
                            Double rating,
                            @Min(value = 0, message = "Rating count cannot be less than 0.")
                            Integer ratingCount,
                            @NotBlank(message = "First photo cannot be empty.")
                            String firstPhoto,
                            @NotEmpty(message = "Spot tags set cannot be empty.")
                            Set<SpotTagDto> tags,
                            @NotNull(message = "Center point cannot be null.")
                            BorderPoint centerPoint
) implements Serializable {
    @Serial
    private static final long serialVersionUID = -2773207588819065352L;

}
