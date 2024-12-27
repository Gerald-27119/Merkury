package com.merkury.vulcanus.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EmailTitle {
    USER_REGISTERED("Register confirmation"),
    PASSWORD_RESET("Password reset");

    private final String title;
}
