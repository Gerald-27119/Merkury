package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.NotBlank;

public record CommentAddDto(@NotBlank
                            String text,
                            @NotBlank
                            Long spotId){}

