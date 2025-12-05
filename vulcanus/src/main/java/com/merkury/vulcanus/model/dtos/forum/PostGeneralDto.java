package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.*;
import lombok.Builder;

import java.util.List;

@Builder
public record PostGeneralDto(@Positive(message = "ID must be a positive number.")
                             Long id,
                             @NotBlank(message = "Title cannot be empty.")
                             String title,
                             @NotBlank(message = "SlugTitle cannot be empty.")
                             String slugTitle,
                             @NotBlank(message = "SummaryContent cannot be empty.")
                             String summaryContent,
                             @NotBlank(message = "Content cannot be empty.")
                             String content,
                             @NotNull(message = "Category cannot be empty")
                             PostCategoryDto category,
                             List<PostTagDto> tags,
                             @Min(value = 0, message = "Views cannot be less than 0.")
                             Integer views,
                             @Min(value = 0, message = "Comments cannot be less than 0")
                             Integer commentsCount,
                             @NotNull(message = "isAuthor cannot be empty.")
                             Boolean isAuthor,
                             @NotNull(message = "isFollowed cannot be empty.")
                             Boolean isFollowed) {
}
