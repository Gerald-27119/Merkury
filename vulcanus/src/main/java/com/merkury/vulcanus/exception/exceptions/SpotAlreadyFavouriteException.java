package com.merkury.vulcanus.exception.exceptions;

public class SpotAlreadyFavouriteException extends Exception{
    public SpotAlreadyFavouriteException(long spotId) {
        super(String.format("Spot with id %d is already added to favourite list", spotId));
    }
}
