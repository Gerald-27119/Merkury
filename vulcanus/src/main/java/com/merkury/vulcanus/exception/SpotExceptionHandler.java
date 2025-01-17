package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotAlreadyFavouriteException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFavouriteException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@ControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class SpotExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(SpotNotFoundException.class)
    public ResponseEntity<String> handleSpotNotFoundException(SpotNotFoundException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(SpotsNotFoundException.class)
    public ResponseEntity<String> handleSpotsNotFoundException(SpotsNotFoundException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(CommentNotFoundException.class)
    public ResponseEntity<String> handleCommentNotFoundException(CommentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(SpotAlreadyFavouriteException.class)
    public ResponseEntity<String> handleSpotAlreadyFavouriteException(SpotAlreadyFavouriteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(SpotNotFavouriteException.class)
    public ResponseEntity<String> handleSpotNotFavouriteException(SpotNotFavouriteException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

}
