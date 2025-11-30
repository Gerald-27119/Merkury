package com.merkury.vulcanus.model.dtos.spot.comment;

import jakarta.validation.constraints.*;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Builder
public record SpotCommentAddDto(@NotBlank(message = "Text cannot be empty.")
                                @Size(max = 1000, min = 1, message = "Text must be between 1 and 1000 characters.")
                                String text,
                                @Min(value = 0, message = "Rating count cannot be less than 0.")
                                @Max(value = 5, message = "Rating count cannot be more than 5.")
                                Double rating,
                                List<MultipartFile> mediaFiles) {
}

