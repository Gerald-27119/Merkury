package com.merkury.vulcanus.model.dtos.spot.comment;

import com.merkury.vulcanus.model.enums.GenericMediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record SpotCommentMediaDto(@Positive(message = "ID must be a positive number.")
                                  Long id,
                                  @Positive(message = "ID in spot media must be a positive number.")
                                  Long idInSpotMedia,
                                  @NotBlank(message = "Url cannot be empty.")
                                  String url,
                                  @NotBlank(message = "Media type cannot be empty.")
                                  GenericMediaType genericMediaType
) {
}
