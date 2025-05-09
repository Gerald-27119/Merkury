package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record AuthorDto(@NotBlank(message = "Author's userName cannot be empty.")
                        String userName,
                        @NotBlank(message = "Author's profilePhoto cannot be empty.")
                        String profilePhoto) {
}
