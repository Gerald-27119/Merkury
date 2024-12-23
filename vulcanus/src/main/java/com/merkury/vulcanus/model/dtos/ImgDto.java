package com.merkury.vulcanus.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImgDto {
    private Long id;
    private String url;
    private String alt;
    private String description;
    private Integer likes;
    private Integer views;
    private String author;
}
