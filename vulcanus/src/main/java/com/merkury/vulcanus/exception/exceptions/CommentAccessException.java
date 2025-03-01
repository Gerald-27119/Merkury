package com.merkury.vulcanus.exception.exceptions;

public class CommentAccessException extends Exception {
    public CommentAccessException(String keyword) {
        super(String.format("You do not have access to %s this comment or it does not exist.", keyword));
    }
}
