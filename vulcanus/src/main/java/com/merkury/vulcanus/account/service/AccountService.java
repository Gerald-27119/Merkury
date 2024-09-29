package com.merkury.vulcanus.account.service;

import com.merkury.vulcanus.account.dto.OAuth2LoginResponseDto;
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
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final RegisterService registerService;
    private final LoginService loginService;
    private final RestartPasswordService restartPasswordService;
    private final UserDataService userDataService;
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

    public OAuth2LoginResponseDto handleOAuth2User(OAuth2AuthenticationToken oAuth2Token) throws EmailTakenException, UsernameTakenException {

        OAuth2User oAuth2User = oAuth2Token.getPrincipal();
        String username = oAuth2User.getAttribute("login");
        String provider = oAuth2Token.getAuthorizedClientRegistrationId();
        String userEmail = oAuth2User.getAttribute("email");

        if (provider.equals("github") && (userEmail == null || userEmail.isEmpty())) {
            userEmail = userDataService.fetchUserEmail(oAuth2Token);
        }

        if (userEmail == null) {
            //TODO:thrown email null exception
        }

        if (!userEntityRepository.existsByEmail(userEmail)) {
            this.registerOauth2User(userEmail, username, provider);
        }

        var jwt = this.loginOauth2User(userEmail);

        return new OAuth2LoginResponseDto(jwt, userEmail);
    }
}
