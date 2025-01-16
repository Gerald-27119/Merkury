package com.merkury.vulcanus.exception.exceptions;

public class SpotAlreadyFavouriteException extends RuntimeException{
    public SpotAlreadyFavouriteException() {
        super("Spot is already added to favourite list");
    }
}
