package com.merkury.vulcanus.model.dtos.spot;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record GeneralSpotDto(@Positive
                      Long id,
                             @NotBlank
                      String areaColor,
                             @NotBlank
                      String name,
                             @Positive
                      @Min(0)
                      Double rating,
                             @NotEmpty
                      List<Double[]> contourCoordinates) {
}
