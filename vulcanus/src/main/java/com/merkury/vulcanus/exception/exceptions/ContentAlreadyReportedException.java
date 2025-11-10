package com.merkury.vulcanus.exception.exceptions;

public class ContentAlreadyReportedException extends Exception {
    public ContentAlreadyReportedException(String contentType) {
        super(String.format("%s has been already reported.", contentType));
    }
}
