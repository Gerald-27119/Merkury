package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.CategoryNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class CategoryExceptionHandler {

    @ExceptionHandler(CategoryNotFoundException.class)
    ResponseEntity<String> handleCategoryNotFoundException(CategoryNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

}
