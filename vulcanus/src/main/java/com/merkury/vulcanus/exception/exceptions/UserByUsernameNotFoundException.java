package com.merkury.vulcanus.exception.exceptions;

public class UserByUsernameNotFoundException extends Exception {
    public UserByUsernameNotFoundException(String username) {
        super("User with username: [" + username + "] not found.");
    }
}
