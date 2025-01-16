package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.SpotAlreadyFavouriteException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFavouriteException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class SpotExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(SpotNotFoundException.class)
    public ResponseEntity<String> handleSpotNotFoundException(SpotNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(SpotAlreadyFavouriteException.class)
    public ResponseEntity<String> handleSpotAlreadyFavouriteException(SpotAlreadyFavouriteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(SpotNotFavouriteException.class)
    public ResponseEntity<String> handleSpotNotFavouriteException(SpotNotFavouriteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

}
