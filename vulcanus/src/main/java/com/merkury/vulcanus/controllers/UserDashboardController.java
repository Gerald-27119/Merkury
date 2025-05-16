package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.account.user.dashboard.UserDashboardService;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-dashboard")
@RequiredArgsConstructor
public class UserDashboardController {
    private final UserDashboardService userDashboardService;

    @GetMapping("/profile/{username}")
    public ResponseEntity<UserProfileDto> getUserProfile(@PathVariable String username) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserProfile(username));
    }

    @GetMapping("/friends/{username}")
    public ResponseEntity<List<SocialDto>> getUserFriends(@PathVariable String username) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFriends(username));
    }
    /// TODO na frontendzie na razie obsłużone jest tylko usuwanie dodawanie będzie zrobione w innym zadaniu
    @PatchMapping("/friends/{username}")
    public ResponseEntity<Void> editUserFriends(@PathVariable String username, @RequestParam String friendUsername, @RequestParam EditUserFriendsType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException {
        userDashboardService.editUserFriends(username, friendUsername, type);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    /// TODO na frontendzie na razie nie jest to obsłużone będzie to zrobione w innym zadaniu
    @PatchMapping("/friends/change-status/{username}")
    public ResponseEntity<Void> changeUserFriendsStatus(@PathVariable String username, @RequestParam String friendUsername, @RequestParam UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        userDashboardService.changeUserFriendsStatus(username, friendUsername, status);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/followers/{username}")
    public ResponseEntity<List<SocialDto>> getUserFollowers(@PathVariable String username) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFollowers(username));
    }

    @GetMapping("/followed/{username}")
    public ResponseEntity<List<SocialDto>> getUserFollowed(@PathVariable String username) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFollowed(username));
    }
    /// TODO na frontendzie na razie obsłużone jest tylko usuwanie dodawanie będzie zrobione w innym zadaniu
    @PatchMapping("/followed/{username}")
    public ResponseEntity<Void> editUserFollowed(@PathVariable String username, @RequestParam String followedUsername, @RequestParam EditUserFriendsType type) throws UserNotFoundByUsernameException, FollowedAlreadyExistException, FollowedNotExistException {
        userDashboardService.editUserFollowed(username, followedUsername, type);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
