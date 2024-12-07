package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.EmailNotSendException;
import com.merkury.vulcanus.exception.exceptions.MissingCredentialsException;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@ControllerAdvice(basePackages = {"com.vulcanus.email"})
public class EmailExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({MessagingException.class, EmailNotSendException.class, MissingCredentialsException.class})
    public ResponseEntity<String> handleMessagingException(Exception ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + ex.getMessage());
    }
}
