package com.merkury.vulcanus.account.dto;

public record LoginResponseDto(String tokenType, String token) {
    public LoginResponseDto(String token) {
        this("Bearer ", token);
    }
}