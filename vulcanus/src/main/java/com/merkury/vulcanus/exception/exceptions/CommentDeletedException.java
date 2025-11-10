package com.merkury.vulcanus.exception.exceptions;

public class CommentDeletedException extends Exception{
    public CommentDeletedException(String commentId){
        super(String.format("Comment with id: %s, is deleted.", commentId));
    }
}
