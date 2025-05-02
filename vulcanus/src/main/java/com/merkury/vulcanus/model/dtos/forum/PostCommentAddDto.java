package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record PostCommentAddDto(@NotBlank(message = "Content cannot be empty.")
                                String content) {
}
