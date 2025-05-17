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
                             @NotNull(message = "Category cannot be null.")
                             CategoryDto category,
                             List<TagDto> tags,
                             @NotNull(message = "Author cannot be null.")
                             AuthorDto author,
                             @NotNull(message = "isAuthor cannot be empty.")
                             Boolean isAuthor,
                             @PastOrPresent(message = "PublishDate must be in the past or present.")
                             @NotNull(message = "PublishDate cannot be null.")
                             LocalDateTime publishDate,
                             @Min(value = 0, message = "Views cannot be less than 0.")
                             Integer views,
                             @Min(value = 0, message = "UpVotes cannot be less than 0.")
                             Integer upVotes,
                             @Min(value = 0, message = "DownVotes cannot be less than 0.")
                             Integer downVotes,
                             @NotNull(message = "isUpVoted cannot be empty.")
                             Boolean isUpVoted,
                             @NotNull(message = "isDownVoted cannot be empty.")
                             Boolean isDownVoted,
                             List<PostCommentDto> comments) {
}
