package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.*;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
@Builder
public record PostDetailsDto(@Positive(message = "ID must be a positive number.")
                             Long id,
                             @NotBlank(message = "Title cannot be empty.")
                             String title,
                             @NotBlank(message = "Content cannot be empty.")
                             String content,
                             @NotNull(message = "Category cannot be empty")
                             CategoryDto category,
                             List<String> tags,
                             @NotBlank(message = "Author cannot be empty.")
                             String author,
                             @NotNull(message = "isAuthor cannot be empty.")
                             Boolean isAuthor,
                             @PastOrPresent(message = "PublishDate must be in the past or present.")
                             @NotNull(message = "PublishDate cannot be null.")
                             LocalDateTime publishDate,
                             @Min(value = 0, message = "Views cannot be less than 0.")
                             Integer views,
                             @Min(value = 0, message = "Upvotes cannot be less than 0.")
                             Integer upvotes,
                             @Min(value = 0, message = "Downvotes cannot be less than 0.")
                             Integer downvotes,
                             @NotNull(message = "isUpvoted cannot be empty.")
                             Boolean isUpvoted,
                             @NotNull(message = "isDownvoted cannot be empty.")
                             Boolean isDownvoted,
                             List<PostCommentDto> comments) {
}
