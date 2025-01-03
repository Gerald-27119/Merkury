package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.NotBlank;

public record CommentEditDto(@NotBlank
                            String text,
                             @NotBlank
                            Long commentId){}

