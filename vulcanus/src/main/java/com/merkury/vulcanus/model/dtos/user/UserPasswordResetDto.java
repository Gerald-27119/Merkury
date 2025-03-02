package com.merkury.vulcanus.model.dtos.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserPasswordResetDto(@NotBlank(message = "Token cannot be empty.")
                                   @Pattern(regexp = "^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$", message = "Token must be a valid UUID.")
                                   String token,
                                   @NotBlank(message = "Password cannot be empty.")
                                   @Pattern(regexp = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:])(\\S)*$", message = "Password must contain at least one digit, one uppercase letter, one lowercase letter and one special character.")
                                   @Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters long.")
                                   String password) {
}
