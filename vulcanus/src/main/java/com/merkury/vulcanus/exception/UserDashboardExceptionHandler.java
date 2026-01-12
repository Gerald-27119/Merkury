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

    @ExceptionHandler(UserIdByUsernameNotFoundException.class)
    public ResponseEntity<String> handleUserIdByUsernameNotFoundException(UserIdByUsernameNotFoundException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(FriendshipAlreadyExistException.class)
    public ResponseEntity<String> handleFriendshipAlreadyExistException(FriendshipAlreadyExistException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(UserAlreadyFollowedException.class)
    public ResponseEntity<String> handleFollowedAlreadyExistException(UserAlreadyFollowedException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(FriendshipNotExistException.class)
    public ResponseEntity<String> handleFriendshipNotExistException(FriendshipNotExistException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(UserNotFollowedException.class)
    public ResponseEntity<String> handleFollowedConnectionNotExistException(UserNotFollowedException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(UnsupportedEditUserFriendsTypeException.class)
    public ResponseEntity<String> handleUnsupportedEditUserFriendsTypeException(UnsupportedEditUserFriendsTypeException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(FavoriteSpotNotExistException.class)
    public ResponseEntity<String> handleFavoriteSpotNotExistException(FavoriteSpotNotExistException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(UnsupportedDateSortTypeException.class)
    public ResponseEntity<String> handleUnsupportedPhotoSortTypeException(UnsupportedDateSortTypeException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(SameUsernameException.class)
    public ResponseEntity<String> handleSameUsernameException(SameUsernameException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(SameEmailException.class)
    public ResponseEntity<String> handleSameEmailException(SameEmailException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(SamePasswordException.class)
    public ResponseEntity<String> handleSamePasswordException(SamePasswordException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(ExternalProviderAccountException.class)
    public ResponseEntity<String> handleExternalProviderAccountException(ExternalProviderAccountException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(UnsupportedUserSettingsType.class)
    public ResponseEntity<String> handleUnsupportedUserSettingsType(UnsupportedUserSettingsType ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(UnsupportedUserFriendStatusException.class)
    public ResponseEntity<String> handleUnsupportedUserFriendStatusException(UnsupportedUserFriendStatusException ex) {
        log.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
