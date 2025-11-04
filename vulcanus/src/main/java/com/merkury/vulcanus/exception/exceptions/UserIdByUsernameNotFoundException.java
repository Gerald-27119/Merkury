package com.merkury.vulcanus.exception.exceptions;

public class UserIdByUsernameNotFoundException extends Exception {
    public UserIdByUsernameNotFoundException(String username) {
        super(String.format("User id not found by username: %s", username));
    }
}
