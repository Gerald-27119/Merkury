package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record OAuth2LoginResponseDto(@NotBlank(message = "User email cannot be empty.")
                                     @Email(message = "Email must be valid.")
                                     String userEmail,
                                     @NotBlank(message = "IsUserRegistered cannot be empty.")
                                     Boolean isUserRegistered) {
}
