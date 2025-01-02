package com.merkury.vulcanus.model.dtos;

import com.merkury.vulcanus.model.enums.Provider;

public record GetUserDto(Long id, String username, Provider provider, String email, String password) {
}
