package com.merkury.vulcanus.exception.exceptions;

public class OwnContentReportException extends Exception{
    public OwnContentReportException(String contentType) {
        super(String.format("You can't report your own %s.", contentType));
    }
}
