package com.merkury.vulcanus.account.excepion.excpetions;

public class UsernameNotFoundException extends Exception {
    public UsernameNotFoundException() {
        super("Username not found!");
    }
}
