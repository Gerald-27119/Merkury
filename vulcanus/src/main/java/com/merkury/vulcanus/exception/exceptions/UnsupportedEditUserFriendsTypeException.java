package com.merkury.vulcanus.exception.exceptions;

import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;

public class UnsupportedEditUserFriendsTypeException extends Exception {
    public UnsupportedEditUserFriendsTypeException(EditUserFriendsType type) {
      super("Unsupported EditUserFriendsType: " + type);
    }
}
