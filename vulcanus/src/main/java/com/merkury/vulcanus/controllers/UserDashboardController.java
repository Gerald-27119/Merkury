package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.account.user.dashboard.UserDashboardService;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import jakarta.servlet.http.HttpServletRequest;
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

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getUserProfile(HttpServletRequest request) throws UserNotFoundByUsernameException {
        var user = userDashboardService.getUserProfile(request);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @GetMapping("/friends")
    public ResponseEntity<List<SocialDto>> getUserFriends(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFriends(request));
    }

    /// TODO na frontendzie na razie obsłużone jest tylko usuwanie dodawanie będzie zrobione w innym zadaniu
    @PatchMapping("/friends")
    public ResponseEntity<Void> editUserFriends(HttpServletRequest request, @RequestParam String friendUsername, @RequestParam EditUserFriendsType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        userDashboardService.editUserFriends(request, friendUsername, type);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /// TODO na frontendzie na razie nie jest to obsłużone będzie to zrobione w innym zadaniu
    @PatchMapping("/friends/change-status")
    public ResponseEntity<Void> changeUserFriendsStatus(HttpServletRequest request, @RequestParam String friendUsername, @RequestParam UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        userDashboardService.changeUserFriendsStatus(request, friendUsername, status);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/followers")
    public ResponseEntity<List<SocialDto>> getUserFollowers(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFollowers(request));
    }

    @GetMapping("/followed")
    public ResponseEntity<List<SocialDto>> getUserFollowed(HttpServletRequest request) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFollowed(request));
    }

    /// TODO na frontendzie na razie obsłużone jest tylko usuwanie dodawanie będzie zrobione w innym zadaniu
    @PatchMapping("/followed")
    public ResponseEntity<Void> editUserFollowed(HttpServletRequest request, @RequestParam String followedUsername, @RequestParam EditUserFriendsType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        userDashboardService.editUserFollowed(request, followedUsername, type);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
