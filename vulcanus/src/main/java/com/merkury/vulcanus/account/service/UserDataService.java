package com.merkury.vulcanus.account.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class UserDataService {
    private final OAuth2AuthorizedClientService oAuth2AuthorizedClientService;
    private final WebClient webClient;
    private final String GITHUB_EMAIL_ENDPOINT = "https://api.github.com/user/emails";

    public String fetchUserEmail(OAuth2AuthenticationToken oAuth2AuthenticationToken) {
        OAuth2AuthorizedClient client = oAuth2AuthorizedClientService.loadAuthorizedClient(
                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId(),
                oAuth2AuthenticationToken.getName()
        );

        List<Map<String, Object>> emailsList = webClient
                .get()
                .uri(GITHUB_EMAIL_ENDPOINT)
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
