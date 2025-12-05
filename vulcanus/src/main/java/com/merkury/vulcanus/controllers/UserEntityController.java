package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.features.user.UserEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserEntityController {

    private final UserEntityService userService;

    @GetMapping("/public/user/search/hints/{username}")
    public ResponseEntity<List<String>> searchUsers(@PathVariable String username) {
        return ResponseEntity.ok(userService.searchUsers(username));
    }

}
