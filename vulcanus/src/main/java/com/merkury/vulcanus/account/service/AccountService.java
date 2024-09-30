package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.dto.UserPasswordResetDto;
import com.merkury.vulcanus.account.dto.UserRegisterDto;
import com.merkury.vulcanus.account.excepion.excpetions.EmailTakenException;
import com.merkury.vulcanus.account.excepion.excpetions.InvalidCredentialsException;
import com.merkury.vulcanus.account.excepion.excpetions.UserNotFoundException;
import com.merkury.vulcanus.account.excepion.excpetions.UsernameTakenException;
import jakarta.servlet.http.HttpServletResponse;
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

    public void loginUser(UserLoginDto userDto, HttpServletResponse response) throws InvalidCredentialsException {
        loginService.loginUser(userDto, response);
    }

    public void restartUserPassword(UserPasswordResetDto userPasswordResetDto) throws UserNotFoundException {
        restartPasswordService.restartUserPassword(userPasswordResetDto);
    }

    public void checkIfUserToResetPasswordExists(String emailAddress) {
        restartPasswordService.checkIfUserToResetPasswordExists(emailAddress);
    }
}
