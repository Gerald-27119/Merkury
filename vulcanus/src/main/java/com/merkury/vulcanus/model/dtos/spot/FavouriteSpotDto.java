package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.dtos.ImgDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

public record FavouriteSpotDto(
        @Positive Long id,
        @NotBlank String name,
        @NotEmpty ImgDto img
) {
}