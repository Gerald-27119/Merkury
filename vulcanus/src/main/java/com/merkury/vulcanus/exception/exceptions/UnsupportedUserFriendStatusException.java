package com.merkury.vulcanus.exception.exceptions;

import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;

public class UnsupportedUserFriendStatusException extends Exception {
    public UnsupportedUserFriendStatusException(UserFriendStatus status) {
        super("Unsupported UserFriendStatus: " + status);
    }
}
