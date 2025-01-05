package com.merkury.vulcanus.features.account;

import com.merkury.vulcanus.exception.exceptions.EmailNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidPasswordException;
import com.merkury.vulcanus.exception.exceptions.UsernameNotFoundException;
import com.merkury.vulcanus.model.dtos.GetUserDto;
import com.merkury.vulcanus.model.dtos.OAuth2LoginResponseDto;
import com.merkury.vulcanus.model.dtos.UserEditDataDto;
import com.merkury.vulcanus.model.dtos.UserLoginDto;
import com.merkury.vulcanus.model.dtos.UserPasswordResetDto;
import com.merkury.vulcanus.model.dtos.UserRegisterDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.exception.exceptions.EmailTakenException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UsernameTakenException;
import com.merkury.vulcanus.security.jwt.JwtGenerator;
import com.merkury.vulcanus.security.jwt.JwtManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.merkury.vulcanus.exception.exceptions.PasswordResetTokenIsInvalidException;
import com.merkury.vulcanus.exception.exceptions.PasswordResetTokenNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final RegisterService registerService;
    private final LoginService loginService;
    private final RestartPasswordService restartPasswordService;
    private final UserDataService userDataService;
    private final UserEntityRepository userEntityRepository;
    private final JwtGenerator jwtGenerator;
    private final JwtManager jwtManager;

    public void registerUser(UserRegisterDto userDto) throws EmailTakenException, UsernameTakenException {
        registerService.registerUser(userDto);
    }

    public void loginUser(UserLoginDto userDto, HttpServletResponse response) throws InvalidCredentialsException {
        loginService.loginUser(userDto, response);
    }

    public void restartUserPassword(UserPasswordResetDto userPasswordResetDto) throws UserNotFoundException, PasswordResetTokenIsInvalidException, PasswordResetTokenNotFoundException {
        restartPasswordService.restartUserPassword(userPasswordResetDto);
    }

    private void registerOauth2User(String email, String username, String provider) throws EmailTakenException, UsernameTakenException {
        registerService.registerOauth2User(email, username, provider);
    }

    private void loginOauth2User(String email, HttpServletResponse response) {
        Optional<UserEntity> user = userEntityRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException(String.format("User with %s not found.", email));
        }

        loginService.loginOauth2User(user.get(), response);
    }

    public OAuth2LoginResponseDto handleOAuth2User(OAuth2AuthenticationToken oAuth2Token, HttpServletResponse response)
            throws EmailTakenException, UsernameTakenException, EmailNotFoundException, UsernameNotFoundException {

        Boolean shouldSendRegisterEmail = false;
        OAuth2User oAuth2User = oAuth2Token.getPrincipal();
        String username;
        String provider = oAuth2Token.getAuthorizedClientRegistrationId();
        username = switch (provider) {
            case "github" -> oAuth2User.getAttribute("login");
            case "google" -> oAuth2User.getAttribute("given_name");
            default -> null;
        };

        if (!StringUtils.hasText(username)) {
            throw new UsernameNotFoundException();
        }

        String userEmail = oAuth2User.getAttribute("email");
        if (!StringUtils.hasText(userEmail) && provider.equals("github")) {
            userEmail = userDataService.getUserEmailFromGithub(oAuth2Token);
        } else if (!StringUtils.hasText(userEmail)) {
            throw new EmailNotFoundException();
        }


        if (!userEntityRepository.existsByEmail(userEmail)) {
            this.registerOauth2User(userEmail, username, provider);
            shouldSendRegisterEmail = true;
        }

        this.loginOauth2User(userEmail, response);

        return new OAuth2LoginResponseDto(userEmail, shouldSendRegisterEmail);
    }

    public GetUserDto editUserData(Long userId, UserEditDataDto userEditDataDto, HttpServletRequest request, HttpServletResponse response) throws InvalidPasswordException, EmailTakenException, UsernameTakenException, InvalidCredentialsException {
        var updatedUser = userDataService.editUserData(userId, userEditDataDto, request);

        var userFromDb = userEntityRepository.findById(userId);
        if (userFromDb.isEmpty()) {
            throw new UserNotFoundException("User not found!");
        }
        regenerateToken(userFromDb.get(), response);

        return updatedUser;
    }

    public GetUserDto getUser(HttpServletRequest request) {
        return userDataService.getUserData(request);
    }

    private void regenerateToken(UserEntity user, HttpServletResponse response){
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user.getUsername(), null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        jwtManager.addTokenToCookie(response, jwtGenerator.generateToken());
    }
}
