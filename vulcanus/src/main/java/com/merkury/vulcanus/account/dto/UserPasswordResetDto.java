package com.merkury.vulcanus.account.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserPasswordResetDto(@NotBlank
                                   String username,
                                   @NotBlank
                                   @Pattern(regexp="^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:])(\\S)*$")
                                   @Size(min=8,max=16)
                                   String password) {
}
