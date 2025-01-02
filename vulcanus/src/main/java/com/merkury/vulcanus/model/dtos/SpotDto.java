package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpotDto {
    @Positive
    private Long id;
    @NotBlank
    private String areaColor;
    @NotBlank
    private String name;
    @NotBlank
    private String description;
    @NotEmpty
    private List<Double[]> contourCoordinates;
    @NotEmpty
    private List<CommentDto> comments;
    @Positive
    @Min(0)
    private Double rating;
    @Positive
    @Min(0)
    private Integer viewsCount;
    @NotEmpty
    private List<ImgDto> photos;
}
