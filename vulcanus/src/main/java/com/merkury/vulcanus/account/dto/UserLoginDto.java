package com.merkury.vulcanus.account.dto;


import jakarta.validation.constraints.NotBlank;

public record UserLoginDto(@NotBlank(message = "Username can't be empty.")
                           String username,
                           @NotBlank(message = "Password can't be empty.")
                           String password) {
}
