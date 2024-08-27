package com.merkury.vulcanus.account.dto;


import jakarta.validation.constraints.NotBlank;

public record UserLoginDto(@NotBlank
                           String username,
                           @NotBlank
                           String password) {
}
