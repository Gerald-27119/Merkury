package com.merkury.vulcanus.model.dtos.user;


import jakarta.validation.constraints.NotBlank;

public record UserLoginDto(@NotBlank(message = "Username cannot be empty.")
                           String username,
                           @NotBlank(message = "Password cannot be empty.")
                           String password) {
}
