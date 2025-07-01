package com.merkury.vulcanus.model.dtos.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record SpotCommentAuthorDto(
        @NotBlank(message = "Username cannot be empty.")
        String username,
        @NotBlank(message = "Url for profile photo cannot be empty.")
        String profilePhotoUrl
) {
}
