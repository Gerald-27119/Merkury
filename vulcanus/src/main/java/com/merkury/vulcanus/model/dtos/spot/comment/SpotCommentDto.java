package com.merkury.vulcanus.model.dtos.spot.comment;

import jakarta.validation.constraints.*;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record SpotCommentDto(@Positive(message = "ID must be a positive number.")
                             Long id,
                             @NotBlank(message = "Author cannot be empty.")
                             SpotCommentAuthorDto author,
                             @NotBlank(message = "Text cannot be empty.")
                             String text,
                             @Min(value = 0, message = "Rating count cannot be less than 0.")
                             @Max(value = 5, message = "Rating count cannot be more than 5.")
                             Double rating,
                             @Min(value = 0, message = "Upvotes cannot be less than 0.")
                             Integer upvotes,
                             @Min(value = 0, message = "Downvotes cannot be less than 0.")
                             Integer downvotes,
                             @PastOrPresent(message = "PublishDate must be in the past or present.")
                             @NotNull(message = "PublishDate cannot be null.")
                             LocalDateTime publishDate,
                             @NotNull(message = "isUpVoted cannot be empty.")
                             Boolean isUpVoted,
                             @NotNull(message = "isDownVoted cannot be empty.")
                             Boolean isDownVoted,
                             @Min(value = 0, message = "Number of media cannot be less than 0.")
                             Integer numberOfMedia,
                             List<SpotCommentMediaDto> mediaList
) {
}
