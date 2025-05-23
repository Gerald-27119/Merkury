package com.merkury.vulcanus.exception.exceptions;

public class UserNotFollowedException extends Exception {
    public UserNotFollowedException() {
        super("Not following this user");
    }
}
