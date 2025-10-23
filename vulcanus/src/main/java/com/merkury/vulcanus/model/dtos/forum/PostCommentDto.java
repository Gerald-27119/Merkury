package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record PostCommentDto(@NotBlank(message = "Content cannot be empty.")
                                String content) {
}
