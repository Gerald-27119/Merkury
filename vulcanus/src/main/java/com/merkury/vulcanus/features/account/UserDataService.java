package com.merkury.vulcanus.features.account;

import com.merkury.vulcanus.exception.exceptions.EmailNotFoundException;
import com.merkury.vulcanus.config.properties.UrlsProperties;
import com.merkury.vulcanus.exception.exceptions.EmailTakenException;
import com.merkury.vulcanus.exception.exceptions.InvalidPasswordException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UsernameTakenException;
import com.merkury.vulcanus.model.dtos.GetUserBasicInfoDto;
import com.merkury.vulcanus.model.dtos.user.UserEditDataDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.security.jwt.JwtManager;
import com.merkury.vulcanus.security.jwt.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RequiredArgsConstructor
@Service
public class UserDataService {
    private final OAuth2AuthorizedClientService oAuth2AuthorizedClientService;
    private final WebClient webClient;
    private final UrlsProperties urlsProperties;
    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtManager jwtManager;
    private final JwtService jwtService;

    public UserEntity getUserFromRequest(HttpServletRequest request) throws UserNotFoundException {
        String token = jwtManager.getJWTFromCookie(request);
        String username = jwtManager.getUsernameFromJWT(token);

        return userEntityRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User with provided id doesn't exist!"));
    }

    public boolean isJwtPresent(HttpServletRequest request) {
        String token = jwtManager.getJWTFromCookie(request);
        return token != null && !token.isEmpty();
    }

    public GetUserBasicInfoDto getUserData(HttpServletRequest request) throws UserNotFoundException {
        String token = jwtManager.getJWTFromCookie(request);
        String username = jwtManager.getUsernameFromJWT(token);
        var userFromDb = userEntityRepository.findByUsername(username);
        if (userFromDb.isEmpty()) {
            throw new UserNotFoundException("User with provided id doesn't exist!");
        }
        var user = userFromDb.get();

        return new GetUserBasicInfoDto(user.getId(), user.getUsername(), user.getProvider(), user.getEmail());
    }

    public GetUserBasicInfoDto editUserData(Long userId, UserEditDataDto userEditDataDto, HttpServletRequest request, HttpServletResponse response)
            throws InvalidPasswordException, EmailTakenException, UsernameTakenException, UserNotFoundException {

        String token = jwtManager.getJWTFromCookie(request);
        String username = jwtManager.getUsernameFromJWT(token);
        var userData = userEntityRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User with provided id doesn't exist!"));

        if (!username.equals(userData.getUsername()) && !username.equals("admin")) {
            throw new AccessDeniedException("You do not have permission to edit this user's data.");
        }

        if (userData.getProvider().equals(Provider.NONE)) {
            if (userEditDataDto.isPasswordChanged()) {
                if (userEditDataDto.oldPassword() == null || !passwordEncoder.matches(userEditDataDto.oldPassword(), userData.getPassword())) {
                    throw new InvalidPasswordException("Old password is invalid!");
                }

                String password = userEditDataDto.password();

                String passwordRegex = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:])(\\S){8,16}$";
                Pattern pattern = Pattern.compile(passwordRegex);

                if (password == null || !pattern.matcher(password).matches()) {
                    throw new InvalidPasswordException("Password must be 8-16 characters long, contain at least one digit, one uppercase letter, one lowercase letter, and one special character.");
                }

                userData.setPassword(passwordEncoder.encode(userEditDataDto.password()));
            }

            if (userEntityRepository.existsByEmailAndIdNot(userEditDataDto.email(), userId)) {
                throw new EmailTakenException();
            }
            userData.setEmail(userEditDataDto.email());
        }

        if (userEntityRepository.existsByUsernameAndIdNot(userEditDataDto.username(), userId)) {
            throw new UsernameTakenException();
        }
        userData.setUsername(userEditDataDto.username());

        var editedUser = userEntityRepository.save(userData);

        var userFromDb = userEntityRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User with provided id doesn't exist!"));

        jwtService.refreshUserToken(userFromDb, response);

        return new GetUserBasicInfoDto(editedUser.getId(), editedUser.getUsername(), editedUser.getProvider(), editedUser.getEmail());
    }

    public String getUserEmailFromGithub(OAuth2AuthenticationToken oAuth2AuthenticationToken) throws EmailNotFoundException {
        var userEmail = this.fetchUserEmailFromGithub(oAuth2AuthenticationToken);
        if (StringUtils.hasText(userEmail)) {
            return userEmail;
        } else {
            throw new EmailNotFoundException();
        }
    }

    private String fetchUserEmailFromGithub(OAuth2AuthenticationToken oAuth2AuthenticationToken) {
        OAuth2AuthorizedClient client = oAuth2AuthorizedClientService.loadAuthorizedClient(
                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId(),
                oAuth2AuthenticationToken.getName()
        );

        var githubEmailEndpoint = urlsProperties.getGithubEmailEndpoint();
        List<Map<String, Object>> emailsList = webClient
                .get()
                .uri(githubEmailEndpoint)
                .attributes(ServletOAuth2AuthorizedClientExchangeFilterFunction.oauth2AuthorizedClient(client))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {
                })
                .block();

        if (emailsList == null || emailsList.isEmpty()) {
            return null;
        }

        return emailsList.stream()
                .filter(email -> Boolean.TRUE.equals(email.get("primary")) &&
                        Boolean.TRUE.equals(email.get("verified")))
                .map(email -> (String) email.get("email"))
                .findFirst()
                .orElse(null);
    }
}
