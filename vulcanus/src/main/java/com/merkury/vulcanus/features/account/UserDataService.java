package com.merkury.vulcanus.features.account;

import com.merkury.vulcanus.exception.exceptions.EmailNotFoundException;
import com.merkury.vulcanus.config.properties.UrlsProperties;
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

@RequiredArgsConstructor
@Service
public class UserDataService {
    private final OAuth2AuthorizedClientService oAuth2AuthorizedClientService;
    private final WebClient webClient;
    private final UrlsProperties urlsProperties;

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
