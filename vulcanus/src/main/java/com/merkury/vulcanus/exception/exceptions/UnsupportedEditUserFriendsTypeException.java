package com.merkury.vulcanus.exception.exceptions;

import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;

public class UnsupportedEditUserFriendsTypeException extends Exception {
    public UnsupportedEditUserFriendsTypeException(UserRelationEditType type) {
      super("Unsupported EditUserFriendsType: " + type);
    }
}
