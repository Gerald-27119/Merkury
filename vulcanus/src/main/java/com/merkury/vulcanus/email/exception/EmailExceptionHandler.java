package com.merkury.vulcanus.email.exception;

import com.merkury.vulcanus.email.exception.exceptions.EmailNotSendException;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice(basePackages = {"com.vulcanus.email"})
public class EmailExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({MessagingException.class, EmailNotSendException.class})
    public ResponseEntity<String> handleMessagingException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + ex.getMessage());
    }
}
