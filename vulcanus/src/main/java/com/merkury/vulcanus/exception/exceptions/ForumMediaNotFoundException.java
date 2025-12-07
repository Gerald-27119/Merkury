package com.merkury.vulcanus.exception.exceptions;

public class ForumMediaNotFoundException extends Exception{
    public ForumMediaNotFoundException(Long id){
        super(String.format("Forum media with id %s not found", id));
    }
}
