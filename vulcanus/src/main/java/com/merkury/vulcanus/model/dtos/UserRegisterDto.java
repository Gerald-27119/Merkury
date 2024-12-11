package com.merkury.vulcanus.model.dtos;

import jakarta.validation.constraints.*;

public record UserRegisterDto(@NotBlank
                              @Pattern(regexp="^[a-zA-Z0-9_]*$")
                              @Size(min=3,max=16)
                              String username,
                              @NotBlank
                              @Size(max=100)
                              @Email
                              String email,
                              @NotBlank
                              @Pattern(regexp="^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:])(\\S)*$")
                              @Size(min=8,max=16)
                              String password) {
}
