package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.CommentAccessException;
import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.SpotCommentRatingOutOfBoundariesException;
import com.merkury.vulcanus.exception.exceptions.SpotCommentTextOutOfBoundariesException;
import com.merkury.vulcanus.exception.exceptions.SpotMediaNumberOfMediaExceeded;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class CommentExceptionHandler {

    @ExceptionHandler(CommentNotFoundException.class)
    public ResponseEntity<String> handleCommentNotFoundException(CommentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(CommentAccessException.class)
    public ResponseEntity<String> handleCommentAccessException(CommentAccessException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler({SpotMediaNumberOfMediaExceeded.class,
            SpotCommentRatingOutOfBoundariesException.class,
            SpotCommentTextOutOfBoundariesException.class})
    public ResponseEntity<String> handleNumberOfMediaInSpotCommentExceeded(Exception ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
