package com.merkury.vulcanus.model.dtos;

import com.merkury.vulcanus.model.enums.Provider;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record GetUserBasicInfoDto(@Positive(message = "ID must be a positive number.")
                                  Long id,
                                  @NotBlank(message = "Username cannot be empty.")
                                  String username,
                                  Provider provider,
                                  @NotBlank(message = "Email cannot be empty.")
                                  String email) {
}
