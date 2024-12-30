package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.EmailNotFoundException;
import com.merkury.vulcanus.exception.exceptions.EmailTakenException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UsernameNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UsernameTakenException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@ControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class AccountExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({EmailTakenException.class, UsernameTakenException.class})
    public ResponseEntity<String> handleEmailOrUsernameTakenException(Exception ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<String> handleAuthenticationCredentialsNotFoundException(InvalidCredentialsException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<String> handleGenericException(Exception ex) {
//        log.error(ex.getMessage());
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + ex.getMessage());
//    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(Exception ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler({EmailNotFoundException.class, UsernameNotFoundException.class})
    public ResponseEntity<String> handleUserDataNotFoundException(Exception ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}