package com.merkury.vulcanus.exception.exceptions;

public class CategoryNotFoundException extends Exception{
    public CategoryNotFoundException(String name) {
        super(String.format("Category %s not found", name));
    }
}
