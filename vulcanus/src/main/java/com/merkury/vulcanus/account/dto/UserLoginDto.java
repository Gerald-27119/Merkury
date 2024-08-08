package com.merkury.vulcanus.account.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserLoginDto(@NotBlank(message = "Username can't be empty.")
                           String username,
                           @NotBlank(message = "Password can't be empty.")
                           String password) {

}
