package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.FileUploadFailedException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class AzureBlobExceptionHandler {

    @ExceptionHandler(BlobContainerNotFoundException.class)
    public ResponseEntity<String> handleBlobContainerNotFoundException(BlobContainerNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(FileUploadFailedException.class)
    public ResponseEntity<String> handleFileUploadFailedException(FileUploadFailedException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidFileTypeException.class)
    public ResponseEntity<String> handleInvalidFileTypeException(InvalidFileTypeException ex) {
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(ex.getMessage());
    }
}
