package com.merkury.vulcanus.features.account;

import com.merkury.vulcanus.exception.exceptions.EmailNotFoundException;
import com.merkury.vulcanus.config.properties.UrlsProperties;
import com.merkury.vulcanus.exception.exceptions.InvalidPasswordException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.model.dtos.GetUserDto;
import com.merkury.vulcanus.model.dtos.UserEditDataDto;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
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

    public GetUserDto editUserData(Long userId, UserEditDataDto userEditDataDto) throws InvalidPasswordException {
        var userFromDb = userEntityRepository.findById(userId);
        if (userFromDb.isEmpty()) {
            throw new UserNotFoundException("User with provided id doesn't exist!");
        }

        var userData = userFromDb.get();
        if (userData.getProvider().equals(Provider.NONE)) {
            String password = userEditDataDto.password();

            String passwordRegex = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\s:])(\\S){8,16}$";
            Pattern pattern = Pattern.compile(passwordRegex);

            if (password == null || !pattern.matcher(password).matches()) {
                throw new InvalidPasswordException("Password must be 8-16 characters long, contain at least one digit, one uppercase letter, one lowercase letter, and one special character.");
            }

            userData.setPassword(userEditDataDto.password());
            userData.setEmail(userEditDataDto.email());
        }
        userData.setUsername(userEditDataDto.username());

        var editedUser = userEntityRepository.save(userData);

        return new GetUserDto(editedUser.getId(), editedUser.getUsername(), editedUser.getProvider(), editedUser.getEmail(), editedUser.getPassword());
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
