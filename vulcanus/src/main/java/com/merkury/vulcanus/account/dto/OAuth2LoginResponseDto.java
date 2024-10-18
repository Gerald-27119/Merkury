package com.merkury.vulcanus.account.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record OAuth2LoginResponseDto(
        @NotBlank
        @Email
        String userEmail) {
}
