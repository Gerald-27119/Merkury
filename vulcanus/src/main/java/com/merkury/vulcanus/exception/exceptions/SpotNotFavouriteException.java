package com.merkury.vulcanus.exception.exceptions;

public class SpotNotFavouriteException extends RuntimeException{
    public SpotNotFavouriteException() {
        super("Spot doesn't exists in favourite list");
    }
}
