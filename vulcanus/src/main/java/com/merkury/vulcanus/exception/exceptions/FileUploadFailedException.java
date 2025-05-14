package com.merkury.vulcanus.exception.exceptions;

public class FileUploadFailedException extends RuntimeException {
    public FileUploadFailedException(Throwable cause) {
        super(String.format("Upload to Azure Blob failed: %s", cause.getMessage()), cause);
    }
}

