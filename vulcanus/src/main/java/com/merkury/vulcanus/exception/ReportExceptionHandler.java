package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.ContentAlreadyReportedException;
import com.merkury.vulcanus.exception.exceptions.OwnContentReportException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class ReportExceptionHandler {

    @ExceptionHandler(ContentAlreadyReportedException.class)
    public ResponseEntity<String> contentAlreadyReported(ContentAlreadyReportedException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(OwnContentReportException.class)
    public ResponseEntity<String> ownContentReportException(OwnContentReportException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
}
