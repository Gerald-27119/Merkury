package com.merkury.vulcanus.exception.exceptions;

public class TagNotFoundException extends RuntimeException {
    public TagNotFoundException(String name){
        super(String.format("Tag %s not found", name));
    }
}
