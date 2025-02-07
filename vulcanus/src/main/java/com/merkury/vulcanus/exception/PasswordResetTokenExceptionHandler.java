package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.PasswordResetTokenIsInvalidException;
import com.merkury.vulcanus.exception.exceptions.PasswordResetTokenNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class PasswordResetTokenExceptionHandler {

    @ExceptionHandler({PasswordResetTokenNotFoundException.class})
    public ResponseEntity<String> handleTokenNotFoundException(Exception ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }


    @ExceptionHandler({PasswordResetTokenIsInvalidException.class})
    public ResponseEntity<String> handleInvalidTokenException(Exception ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
