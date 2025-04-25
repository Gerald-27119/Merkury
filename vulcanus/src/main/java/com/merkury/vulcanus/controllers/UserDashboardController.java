package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.features.account.user.dashboard.UserDashboardService;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserDashboardController {
    private final UserDashboardService userDashboardService;

    @GetMapping("/user-dashboard/profile/{username}")
    public ResponseEntity<UserProfileDto> getUserProfile(@PathVariable String username) throws UserNotFoundByUsernameException {
        var user = userDashboardService.getUserProfile(username);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }
}
