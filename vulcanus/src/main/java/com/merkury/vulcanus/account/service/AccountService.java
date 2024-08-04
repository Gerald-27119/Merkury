package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.LoginResponseDto;
import com.merkury.vulcanus.account.excepion.excpetions.EmailTakenException;
import com.merkury.vulcanus.account.excepion.excpetions.InvalidCredentialsException;
import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.dto.UserRegisterDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final RegisterService registerService;
    private final LoginService loginService;

    public void registerUser(UserRegisterDto userDto) throws EmailTakenException {
        registerService.registerUser(userDto);
    }

    public LoginResponseDto loginUser(UserLoginDto userDto) throws InvalidCredentialsException {
        return loginService.loginUser(userDto);
    }
}
