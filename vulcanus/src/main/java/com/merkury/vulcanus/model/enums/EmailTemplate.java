package com.merkury.vulcanus.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EmailTemplate {
    REGISTRATION("registrationEmail"),
    FORGOT_PASSWORD("forgotPasswordEmail");

    private final String templateName;
}
