package com.merkury.vulcanus.exception.excpetions;

public class UsernameNotFoundException extends Exception {
    public UsernameNotFoundException() {
        super("Username not found!");
    }
}
