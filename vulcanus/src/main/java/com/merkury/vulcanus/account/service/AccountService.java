package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.dto.UserPasswordResetDto;
import com.merkury.vulcanus.account.dto.UserRegisterDto;
import com.merkury.vulcanus.account.excepion.excpetions.EmailTakenException;
import com.merkury.vulcanus.account.excepion.excpetions.InvalidCredentialsException;
import com.merkury.vulcanus.account.excepion.excpetions.UserNotFoundException;
import com.merkury.vulcanus.account.excepion.excpetions.UsernameTakenException;
import com.merkury.vulcanus.account.user.UserEntity;
import com.merkury.vulcanus.account.passwordResetToken.service.RestartPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final RegisterService registerService;
    private final LoginService loginService;
    private final RestartPasswordService restartPasswordService;

    public void registerUser(UserRegisterDto userDto) throws EmailTakenException, UsernameTakenException {
        registerService.registerUser(userDto);
    }

    public String loginUser(UserLoginDto userDto) throws InvalidCredentialsException {
        return loginService.loginUser(userDto);
    }

    public void restartUserPassword(UserPasswordResetDto userPasswordResetDto) throws UserNotFoundException {
        restartPasswordService.restartUserPassword(userPasswordResetDto);
    }

    public UserEntity getUserByEmail(String email) {
       return restartPasswordService.getUserByEmail(email);
    }

}
