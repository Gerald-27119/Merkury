package com.merkury.vulcanus.model.dtos.user;

import jakarta.validation.constraints.*;

public record UserRegisterDto(@NotBlank(message = "Username cannot be empty.")
                              @Pattern(regexp = "^\\w+$", message = "Username can only contain letters, numbers and underscores.")
                              @Size(min=3,max=16, message = "Username must be between 3 and 16 characters long.")
                              String username,
                              @NotBlank(message = "Email cannot be empty.")
                              @Size(max=100, message = "Email must be less than 100 characters long.")
                              @Email(message = "Email must be valid.")
                              String email,
                              @NotBlank(message = "Password cannot be empty.")
                              @Pattern(regexp="^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:])(\\S)*$", message = "Password must contain at least one digit, one uppercase letter, one lowercase letter and one special character.")
                              @Size(min=8,max=16, message = "Password must be between 8 and 16 characters long.")
                              String password) {
}
