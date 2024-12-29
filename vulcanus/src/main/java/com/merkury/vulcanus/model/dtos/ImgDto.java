package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImgDto {
    @NotBlank
    private String url;
    @NotBlank
    private String alt;
    @NotBlank
    private String description;
    @Positive
    @Min(0)
    private Integer likes;
    @Positive
    @Min(0)
    private Integer views;
    @NotBlank
    private String author;
}
