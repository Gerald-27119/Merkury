package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.*;
import lombok.Builder;

import java.time.LocalDateTime;
@Builder
public record PostCommentDto(@Positive(message = "ID must be a positive number.")
                             Long id,
                             @NotBlank(message = "Text cannot be empty.")
                             String text,
                             @Min(value = 0, message = "Upvotes cannot be less than 0.")
                             Integer upvotes,
                             @Min(value = 0, message = "Downvotes cannot be less than 0.")
                             Integer downvotes,
                             @PastOrPresent(message = "PublishDate must be in the past or present.")
                             @NotNull(message = "PublishDate cannot be null.")
                             LocalDateTime publishDate,
                             @NotBlank(message = "Author cannot be empty.")
                             String author,
                             @NotNull(message = "isAuthor cannot be empty.")
                             Boolean isAuthor,
                             @NotNull(message = "isUpvoted cannot be empty.")
                             Boolean isUpvoted,
                             @NotNull(message = "isDownvoted cannot be empty.")
                             Boolean isDownvoted) {

}
