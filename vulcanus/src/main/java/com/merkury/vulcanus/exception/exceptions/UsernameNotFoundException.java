package com.merkury.vulcanus.exception.exceptions;

public class UsernameNotFoundException extends Exception {
    public UsernameNotFoundException() {
        super("Username not found!");
    }

    public UsernameNotFoundException(String username) {
        super("User with username: [" + username + "] not found.");
    }
}
