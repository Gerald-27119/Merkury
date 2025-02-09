package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.dtos.comment.CommentDto;
import com.merkury.vulcanus.model.dtos.ImgDto;
import jakarta.validation.constraints.*;

import java.util.List;

public record FullSpotDto(@Positive(message = "ID must be a positive number.")
                          Long id,
                          @NotBlank(message = "Area color cannot be empty.")
                          String areaColor,
                          @NotBlank(message = "Name cannot be empty.")
                          String name,
                          @NotBlank(message = "Description cannot be empty.")
                          String description,
                          @Min(value = 0, message = "Rating count cannot be less than 0.")
                          @Max(value = 5, message = "Rating count cannot be more than 5.")
                          Double rating,
                          @Min(value = 0, message = "Views count cannot be less than 0.")
                          Integer viewsCount,
                          @NotEmpty(message = "Contour coordinates list cannot be empty.")
                          List<Double[]> contourCoordinates,
                          List<CommentDto> comments,
                          @NotEmpty(message = "Photos list cannot be empty.")
                          List<ImgDto> photos) {
}
