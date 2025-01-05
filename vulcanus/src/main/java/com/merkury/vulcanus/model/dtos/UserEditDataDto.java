package com.merkury.vulcanus.model.dtos;

import com.merkury.vulcanus.model.enums.Provider;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserEditDataDto(String password,
                              @NotBlank
                              @Email
                              String email,
                              @NotBlank
                              @Size(min=3,max=16)
                              String username,
                              Provider provider,
                              Boolean isPasswordChanged,
                              String oldPassword) {
}
