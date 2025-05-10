package com.merkury.vulcanus.controllers;

import com.azure.core.annotation.QueryParam;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.features.account.user.dashboard.UserDashboardService;
import com.merkury.vulcanus.model.dtos.account.friends.FriendDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
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
    public ResponseEntity<List<FriendDto>> getUserFriends(@PathVariable String username) throws UserNotFoundByUsernameException {
        return ResponseEntity.ok(userDashboardService.getUserFriends(username));
    }

    @PatchMapping("/friends/{username}")
    public ResponseEntity<Void> editUserFriends(@PathVariable String username, @QueryParam("friendUsername") String friendUsername, @QueryParam("type")EditUserFriendsType type) throws UserNotFoundByUsernameException {
        userDashboardService.editUserFriends(username, friendUsername, type);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
