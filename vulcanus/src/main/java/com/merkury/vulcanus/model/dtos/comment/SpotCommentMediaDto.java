package com.merkury.vulcanus.model.dtos.comment;

import com.merkury.vulcanus.model.enums.GenericMediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record SpotCommentMediaDto(@Positive(message = "ID must be a positive number.")
                                  Long id,
                                  @NotBlank(message = "Url cannot be empty.")
                                  String url,
                                  @NotBlank(message = "Media type cannot be empty.")
                                  GenericMediaType genericMediaType
) {
}
