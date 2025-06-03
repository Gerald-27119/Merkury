package com.merkury.vulcanus.exception.exceptions;

public class FavoriteSpotNotExistException extends Exception {
    public FavoriteSpotNotExistException() {
        super("This favorite spot in not exist.");
    }
}
