package com.merkury.vulcanus.exception.exceptions;

public class AlreadyFollowedException extends Exception {
    public AlreadyFollowedException() {
        super("Already followed this user");
    }
}
