package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice(basePackages = {"com.merkury.vulcanus.controllers"})
public class UserDashboardExceptionHandler {

    @ExceptionHandler(UserNotFoundByUsernameException.class)
    public ResponseEntity<String> handleUserNotFoundByUsernameException(UserNotFoundByUsernameException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(FriendshipAlreadyExistException.class)
    public ResponseEntity<String> handleFriendshipAlreadyExistException(FriendshipAlreadyExistException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(FollowedAlreadyExistException.class)
    public ResponseEntity<String> handleFollowedAlreadyExistException(FollowedAlreadyExistException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(FriendshipNotExistException.class)
    public ResponseEntity<String> handleFriendshipNotExistException(FriendshipNotExistException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(FollowedNotExistException.class)
    public ResponseEntity<String> handleFollowedConnectionNotExistException(FollowedNotExistException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
