package com.merkury.vulcanus.exception.exceptions;

public class SpotAlreadyFavouriteException extends Exception{
    public SpotAlreadyFavouriteException() {
        super("Spot is already added to favourite list");
    }
}
