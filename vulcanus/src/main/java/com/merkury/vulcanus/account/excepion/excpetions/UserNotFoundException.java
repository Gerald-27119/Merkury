package com.merkury.vulcanus.account.excepion.excpetions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
