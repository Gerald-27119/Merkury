package com.merkury.vulcanus.account.dto;

import jakarta.validation.constraints.*;

public record UserRegisterDto(@NotBlank(message = "Username can't be empty.")
                              @Pattern(regexp="/^[a-zA-Z0-9_]$/", message="Unallowed characters.")
                              @Size(min=3,max=16,message="Username must contain 3 to 16 characters.")
                              String username,
                              @NotBlank(message = "Email can't be empty.")
                              @Size(max=100, message="Email too long.")
                              @Email(message="This is not a valid email address.")
                              String email,
                              @NotBlank(message = "Password can't be empty.")
                              @Pattern(regexp="/^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:])(\\S)$/", message="Password must contain a small and big letter, a number and a special character.")
                              @Size(min=8,max=16, message="Password length must be between 8 to 16 characters.")
                              String password) {
}
