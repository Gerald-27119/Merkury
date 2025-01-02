package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserEditDataDto(Long id,
                              String password,
                              @NotBlank
                              @Email
                              String email,
                              @NotBlank
                              @Size(min=3,max=16)
                              String username) {
}
