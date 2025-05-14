package com.merkury.vulcanus.exception.exceptions;

public class TagNotFoundException extends Exception {
    public TagNotFoundException(String name){
        super(String.format("Tag %s not found", name));
    }
}
