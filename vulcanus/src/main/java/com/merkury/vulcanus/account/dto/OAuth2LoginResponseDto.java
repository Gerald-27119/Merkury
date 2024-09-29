package com.merkury.vulcanus.account.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record OAuth2LoginResponseDto(
        @NotBlank
        String jwt,
        @NotBlank
        @Email
        String userEmail) {
}
