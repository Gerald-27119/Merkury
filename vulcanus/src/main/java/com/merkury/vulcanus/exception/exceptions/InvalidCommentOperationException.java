package com.merkury.vulcanus.exception.exceptions;

public class InvalidCommentOperationException extends Exception{
    public InvalidCommentOperationException() {
        super("You cannot reply to your own comment.");
    }
}
