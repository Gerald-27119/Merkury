package com.merkury.vulcanus.model.dtos.user;

import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.enums.user.dashboard.UserSettingsType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserEditDataDto(String newPassword,
                              @NotBlank(message = "Email cannot be empty.")
                              @Email(message = "Email must be valid.")
                              String email,
                              @NotBlank(message = "Username cannot be empty.")
                              @Size(min = 3, max = 16, message = "Username must be between 3 and 16 characters long.")
                              String username,
                              Provider provider,
                              String oldPassword,
                              String confirmPassword,
                              UserSettingsType type) {
    @AssertTrue(message = "New password cannot be empty when changing password.")
    public boolean isNewPasswordValid() {
        return (newPassword != null && !newPassword.trim().isEmpty());
    }

    @AssertTrue(message = "Confirm password cannot be empty when changing password.")
    public boolean isConfirmPasswordValid() {
        return (confirmPassword != null && !confirmPassword.trim().isEmpty());
    }

    @AssertTrue(message = "Old password cannot be empty when changing password.")
    public boolean isOldPasswordValid() {
        return (oldPassword != null && !oldPassword.trim().isEmpty());
    }
}
