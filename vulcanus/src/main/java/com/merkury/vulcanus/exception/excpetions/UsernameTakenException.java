package com.merkury.vulcanus.exception.excpetions;

public class UsernameTakenException extends Exception {

    public UsernameTakenException() {
        super("Username taken");
    }
}
