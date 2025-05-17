package com.merkury.vulcanus.exception.exceptions;

public class PostNotFoundException extends Exception {
    public PostNotFoundException(Long id) {
        super(String.format("Post with id: %d, not found", id));
    }
}
