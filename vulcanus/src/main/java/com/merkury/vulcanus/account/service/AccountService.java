package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.user.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
@RequiredArgsConstructor
public class AccountService {

    private final RegisterService registerService;

    public void registerUser(UserDto userDto) {
        registerService.registerUser(userDto);
    }
}