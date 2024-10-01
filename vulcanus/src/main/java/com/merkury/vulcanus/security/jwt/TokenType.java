package com.merkury.vulcanus.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TokenType {
    ACCESS("accessToken"),
    REFRESH("refreshToken");

    private final String cookieName;
}