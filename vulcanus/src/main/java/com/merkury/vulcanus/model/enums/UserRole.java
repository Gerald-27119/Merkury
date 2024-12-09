package com.merkury.vulcanus.model.enums;

import lombok.Getter;

@Getter
public enum UserRole {
    ROLE_USER("USER"),
    ROLE_ADMIN("ADMIN");

    private final String roleName;

    UserRole(String roleName) {
        this.roleName = roleName;
    }

}
