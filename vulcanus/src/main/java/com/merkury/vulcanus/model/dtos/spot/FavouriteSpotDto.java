package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.dtos.ImgDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record FavouriteSpotDto(@Positive(message = "ID must be a positive number.")
                               Long id,
                               @NotBlank(message = "Name cannot be empty.")
                               String name,
                               @NotBlank(message = "Image cannot be empty.")
                               ImgDto img) {
}