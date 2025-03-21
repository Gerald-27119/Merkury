package com.merkury.vulcanus.model.dtos.user;

import com.merkury.vulcanus.model.enums.Provider;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserEditDataDto(String password,
                              @NotBlank(message = "Email cannot be empty.")
                              @Email(message = "Email must be valid.")
                              String email,
                              @NotBlank(message = "Username cannot be empty.")
                              @Size(min = 3, max = 16, message = "Username must be between 3 and 16 characters long.")
                              String username,
                              Provider provider,
                              Boolean isPasswordChanged,
                              String oldPassword) {
    @AssertTrue(message = "Password cannot be empty when changing password.")
    public boolean isPasswordValid() {
        return !Boolean.TRUE.equals(isPasswordChanged) || (password != null && !password.trim().isEmpty());
    }
    @AssertTrue(message = "Old password cannot be empty when changing password.")
    public boolean isOldPasswordValid() {
        return !Boolean.TRUE.equals(isPasswordChanged) || (oldPassword != null && !oldPassword.trim().isEmpty());
    }
}
