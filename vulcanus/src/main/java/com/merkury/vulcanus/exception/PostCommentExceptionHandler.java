package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.CommentDeletedException;
import com.merkury.vulcanus.exception.exceptions.InvalidCommentOperationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class PostCommentExceptionHandler {

    @ExceptionHandler(InvalidCommentOperationException.class)
    public ResponseEntity<String> handleInvalidCommentOperationException(InvalidCommentOperationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(CommentDeletedException.class)
    public ResponseEntity<String> handleCommentDeletedException(CommentDeletedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }
}
