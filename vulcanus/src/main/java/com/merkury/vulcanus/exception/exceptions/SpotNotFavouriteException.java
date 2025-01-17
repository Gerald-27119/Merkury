package com.merkury.vulcanus.exception.exceptions;

public class SpotNotFavouriteException extends Exception{
    public SpotNotFavouriteException() {
        super("Spot doesn't exists in favourite list");
    }
}
