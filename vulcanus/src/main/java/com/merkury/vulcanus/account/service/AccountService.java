package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.dto.UserRegisterDto;
import com.merkury.vulcanus.account.excepion.excpetions.EmailTakenException;
import com.merkury.vulcanus.account.excepion.excpetions.UsernameTakenException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final RegisterService registerService;
    private final LoginService loginService;

    public void registerUser(UserRegisterDto userDto) throws EmailTakenException, UsernameTakenException {
        registerService.registerUser(userDto);
    }

    public String loginUser(UserLoginDto userDto) {
        return loginService.loginUser(userDto);
    }

}
