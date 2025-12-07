package com.merkury.vulcanus.exception.exceptions;

public class SpotMediaNumberOfMediaExceeded extends Exception {
    public SpotMediaNumberOfMediaExceeded() {
        super("Number of media in comment exceeded. Maximum is 20.");
    }
}
