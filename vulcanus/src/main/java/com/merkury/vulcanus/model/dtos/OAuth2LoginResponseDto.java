package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record OAuth2LoginResponseDto(
        @NotBlank
        @Email
        String userEmail,
        @NotBlank
        Boolean isUserRegistered
        ) {
}
