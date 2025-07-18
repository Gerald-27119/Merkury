package com.merkury.vulcanus.model.dtos.account.settings;

import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.enums.user.dashboard.UserSettingsType;
import jakarta.validation.constraints.AssertTrue;
import lombok.Builder;

@Builder
public record UserEditDataDto(String newPassword,
                              String email,
                              String username,
                              Provider provider,
                              String oldPassword,
                              String confirmPassword,
                              UserSettingsType type
) {
    @AssertTrue(message = "Username cannot be empty and must be 3-16 characters long when changing username.")
    public boolean isUsernameValid() {
        if (type != UserSettingsType.USERNAME) return true;
        return username != null && username.trim().length() >= 3 && username.trim().length() <= 16;
    }

    @AssertTrue(message = "Email cannot be empty and must be valid when changing e-mail.")
    public boolean isEmailValid() {
        if (type != UserSettingsType.EMAIL) return true;
        return email != null && !email.trim().isEmpty() && email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    }

    @AssertTrue(message = "Old password cannot be empty when changing password.")
    public boolean isOldPasswordValid() {
        if (type != UserSettingsType.PASSWORD) return true;
        return oldPassword != null && !oldPassword.trim().isEmpty();
    }

    @AssertTrue(message = "New password cannot be empty when changing password.")
    public boolean isNewPasswordValid() {
        if (type != UserSettingsType.PASSWORD) return true;
        return newPassword != null && !newPassword.trim().isEmpty();
    }

    @AssertTrue(message = "Confirm password cannot be empty when changing password.")
    public boolean isConfirmPasswordValid() {
        if (type != UserSettingsType.PASSWORD) return true;
        return confirmPassword != null && !confirmPassword.trim().isEmpty();
    }

    @AssertTrue(message = "Passwords do not match.")
    public boolean isPasswordMatchValid() {
        if (type != UserSettingsType.PASSWORD) return true;
        return newPassword != null && newPassword.equals(confirmPassword);
    }
}

