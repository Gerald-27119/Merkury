package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.dtos.CommentDto;
import com.merkury.vulcanus.model.dtos.ImgDto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record FullSpotDto(@Positive
                          Long id,
                          @NotBlank
                          String areaColor,
                          @NotBlank
                          String name,
                          @NotBlank
                          String description,
                          @Positive
                          @Min(0)
                          Double rating,
                          @Positive
                          @Min(0)
                          Integer viewsCount,
                          @NotEmpty
                          List<Double[]> contourCoordinates,
                          @NotEmpty
                          List<CommentDto> comments,
                          @NotEmpty
                          List<ImgDto> photos) {
}
