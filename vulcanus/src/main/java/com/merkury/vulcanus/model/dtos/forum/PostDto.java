package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PostDto(@NotBlank(message = "Title cannot be empty.")
                      String title,
                      @NotBlank(message = "Content cannot be empty.")
                      String content,
                      @NotNull(message = "Category cannot be empty")
                      ForumCategoryDto category,
                      List<String> tags) {
}
