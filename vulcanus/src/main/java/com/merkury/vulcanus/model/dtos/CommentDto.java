package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    @Positive
    private Long id;
    @NotBlank
    private String text;
    @Positive
    @Min(0)
    private Double rating;
    @Positive
    @Min(0)
    private Integer likes;
    @PastOrPresent
    @NotNull
    private LocalDateTime publishDate;
    @NotBlank
    private String author;
}
