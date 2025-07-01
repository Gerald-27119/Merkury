package com.merkury.vulcanus.exception.exceptions;

public class UserAlreadyFollowedException extends Exception {
    public UserAlreadyFollowedException() {
        super("Already following this user");
    }
}
