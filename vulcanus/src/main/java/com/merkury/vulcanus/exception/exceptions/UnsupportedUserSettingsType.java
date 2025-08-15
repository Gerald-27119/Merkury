package com.merkury.vulcanus.exception.exceptions;

import com.merkury.vulcanus.model.enums.user.dashboard.UserSettingsType;

public class UnsupportedUserSettingsType extends Exception {
    public UnsupportedUserSettingsType(UserSettingsType type) {
        super("Unsupported UserSettingsType " + type);
    }
}
