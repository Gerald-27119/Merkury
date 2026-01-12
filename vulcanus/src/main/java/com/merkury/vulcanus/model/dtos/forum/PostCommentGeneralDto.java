package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.*;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record PostCommentGeneralDto(@Positive(message = "ID must be a positive number.")
                                    Long id,
                                    @NotBlank(message = "Content cannot be empty.")
                                    String content,
                                    @Min(value = 0, message = "UpVotes cannot be less than 0.")
                                    Integer upVotes,
                                    @Min(value = 0, message = "DownVotes cannot be less than 0.")
                                    Integer downVotes,
                                    @Min(value = 0, message = "Replies cannot be less than 0")
                                    Integer repliesCount,
                                    @PastOrPresent(message = "PublishDate must be in the past or present.")
                                    @NotNull(message = "PublishDate cannot be null.")
                                    LocalDateTime publishDate,
                                    @NotNull(message = "Author cannot be null.")
                                    AuthorDto author,
                                    @NotNull(message = "isAuthor cannot be empty.")
                                    Boolean isAuthor,
                                    @NotNull(message = "isUpVoted cannot be empty.")
                                    Boolean isUpVoted,
                                    @NotNull(message = "isDownVoted cannot be empty.")
                                    Boolean isDownVoted,
                                    @NotNull(message = "isReply cannot be empty.")
                                    Boolean isReply,
                                    @NotNull(message = "isDeleted cannot be empty.")
                                    Boolean isDeleted
) {

}
