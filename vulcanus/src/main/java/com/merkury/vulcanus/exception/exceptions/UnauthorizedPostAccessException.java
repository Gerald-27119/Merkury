package com.merkury.vulcanus.exception.exceptions;

public class UnauthorizedPostAccessException extends Exception {
    public UnauthorizedPostAccessException(String keyword) {
        super(String.format("You do not have access to %s this post or it does not exist.", keyword));
    }
}
