package com.merkury.vulcanus.exception.exceptions;

public class CommentNotFoundException extends RuntimeException {
    public CommentNotFoundException(Long id) {
        super(String.format("Comment with id: %d not found", id));
    }
}
