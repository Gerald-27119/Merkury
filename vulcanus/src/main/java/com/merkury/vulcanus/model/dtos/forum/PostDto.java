package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PostDto(@NotBlank(message = "Title cannot be empty.")
                      @Size(min = 3, max = 100, message = "Title must be from 3 to 100 characters")
                      String title,
                      @NotBlank(message = "Content cannot be empty.")
                      String content,
                      @NotBlank(message = "Category cannot be empty")
                      String category,
                      List<String> tags) {
}
