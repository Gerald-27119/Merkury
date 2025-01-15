package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.dtos.CommentDto;
import com.merkury.vulcanus.model.dtos.ImgDto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record FullSpotDto(@Positive(message = "ID must be a positive number.")
                          Long id,
                          @NotBlank(message = "Area color cannot be empty.")
                          String areaColor,
                          @NotBlank(message = "Name cannot be empty.")
                          String name,
                          @NotBlank(message = "Description cannot be empty.")
                          String description,
                          @Positive(message = "Rating must be a positive number.")
                          @Min(value = 0, message = "Rating cannot be less than 0.")
                          Double rating,
                          @Positive(message = "Views count must be a positive number.")
                          @Min(value = 0, message = "Views count cannot be less than 0.")
                          Integer viewsCount,
                          @NotEmpty(message = "Contour coordinates list cannot be empty.")
                          List<Double[]> contourCoordinates,
                          @NotEmpty(message = "Comments list cannot be empty.")
                          List<CommentDto> comments,
                          @NotEmpty(message = "Photos list cannot be empty.")
                          List<ImgDto> photos
) {
}
