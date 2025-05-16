package com.merkury.vulcanus.exception.exceptions;

public class InvalidFileTypeException extends Exception{
    public InvalidFileTypeException(String type) {
        super(String.format("Unsupported content type: %s", type));
    }
}
