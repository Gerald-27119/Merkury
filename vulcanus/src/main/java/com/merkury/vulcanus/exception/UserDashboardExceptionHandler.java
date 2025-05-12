package com.merkury.vulcanus.exception;

import com.merkury.vulcanus.exception.exceptions.FollowedConnectionAlreadyExist;
import com.merkury.vulcanus.exception.exceptions.FriendshipAlreadyExist;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
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

    @ExceptionHandler(FriendshipAlreadyExist.class)
    public ResponseEntity<String> handleFriendshipAlreadyExistException(FriendshipAlreadyExist ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(FollowedConnectionAlreadyExist.class)
    public ResponseEntity<String> handleFollowedAlreadyExistException(FollowedConnectionAlreadyExist ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
}
