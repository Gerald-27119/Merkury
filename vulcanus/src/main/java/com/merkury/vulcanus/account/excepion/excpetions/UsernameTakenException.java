package com.merkury.vulcanus.account.excepion.excpetions;

public class UsernameTakenException extends Exception {

    public UsernameTakenException() {
        super("Username taken");
    }
}
