package com.merkury.vulcanus.account;

import com.merkury.vulcanus.account.service.AccountService;
import com.merkury.vulcanus.account.user.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public ResponseEntity<Void> registerUser(@RequestBody UserDto userDto) {
        accountService.registerUser(userDto);
        return null;
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/login")
    public ResponseEntity<Void> loginUser(@RequestBody UserDto userDto) {
        return null;
    }
}