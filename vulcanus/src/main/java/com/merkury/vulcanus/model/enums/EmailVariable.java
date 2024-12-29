package com.merkury.vulcanus.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EmailVariable {
    USERNAME("username"),
    RESET_LINK("resetLink");

    private final String variable;
}
