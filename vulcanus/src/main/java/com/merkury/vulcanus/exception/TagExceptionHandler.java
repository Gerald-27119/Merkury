package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.TagNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class TagExceptionHandler {

    @ExceptionHandler(TagNotFoundException.class)
    public ResponseEntity<String> tagNotFoundException(TagNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
