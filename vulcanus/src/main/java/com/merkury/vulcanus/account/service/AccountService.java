package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.UserLoginDto;
import com.merkury.vulcanus.account.dto.UserPasswordResetDto;
import com.merkury.vulcanus.account.dto.UserRegisterDto;
import com.merkury.vulcanus.account.excepion.excpetions.EmailTakenException;
import com.merkury.vulcanus.account.excepion.excpetions.InvalidCredentialsException;
import com.merkury.vulcanus.account.excepion.excpetions.UserNotFoundException;
import com.merkury.vulcanus.account.excepion.excpetions.UsernameTakenException;
import com.merkury.vulcanus.account.user.UserEntity;
import com.merkury.vulcanus.account.user.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final RegisterService registerService;
    private final LoginService loginService;
    private final RestartPasswordService restartPasswordService;
    private final UserEntityRepository userEntityRepository;

    public void registerUser(UserRegisterDto userDto) throws EmailTakenException, UsernameTakenException {
        registerService.registerUser(userDto);
    }

    public String loginUser(UserLoginDto userDto) throws InvalidCredentialsException {
        return loginService.loginUser(userDto);
    }

    public void restartUserPassword(UserPasswordResetDto userPasswordResetDto) throws UserNotFoundException {
        restartPasswordService.restartUserPassword(userPasswordResetDto);
    }

    public void checkIfUserToResetPasswordExists(String emailAddress) {
        restartPasswordService.checkIfUserToResetPasswordExists(emailAddress);
    }

    private void registerOauth2User(String email, String username, String provider) throws EmailTakenException, UsernameTakenException {
        registerService.registerOauth2User(email, username, provider);
    }

    private String loginOauth2User(String email) {
        Optional<UserEntity> user = userEntityRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException(String.format("User with %s not found.", email));
        }

        return loginService.loginOauth2User(user.get());
    }

    public String handleOAuth2User(String email, String username, String provider) throws EmailTakenException, UsernameTakenException {
        if (!userEntityRepository.existsByEmail(email)) {
            this.registerOauth2User(email, username, provider);
        }

        return this.loginOauth2User(email);
    }
}
