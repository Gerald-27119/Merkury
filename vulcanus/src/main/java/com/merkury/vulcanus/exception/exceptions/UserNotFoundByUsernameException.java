package com.merkury.vulcanus.exception.exceptions;

public class UserNotFoundByUsernameException extends Exception {
    public UserNotFoundByUsernameException(String username) {
        super("USer not found with username: " + username);
    }
}
