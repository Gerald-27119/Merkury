package com.merkury.vulcanus.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;

import java.util.Arrays;

@Configuration
public class OAuth2Config {

    @Value("${spring.security.oauth2.client.registration.github.client-id}")
    private String githubClientId;

    @Value("${spring.security.oauth2.client.registration.github.client-secret}")
    private String githubClientSecret;

    @Value("${spring.security.oauth2.client.registration.github.redirect-uri}")
    private String githubRedirectUri;

    @Value(("${spring.security.oauth2.client.provider.github.authorization-uri}"))
    private String githubAuthorizationUri;

    @Value("${spring.security.oauth2.client.provider.github.token-uri}")
    private String githubTokenUri;

    @Value("${spring.security.oauth2.client.provider.github.user-info-uri}")
    private String githubUserInfoUri;

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        return new InMemoryClientRegistrationRepository(
                Arrays.asList(
                        getGithubClientRegistration()
                )
        );
    }

    private ClientRegistration getGithubClientRegistration() {
        return ClientRegistration.withRegistrationId("github")
                .clientId(githubClientId)
                .clientSecret(githubClientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri(githubRedirectUri)
                .scope("openid", "profile", "email")
                .authorizationUri(githubAuthorizationUri)
                .tokenUri(githubTokenUri)
                .userInfoUri(githubUserInfoUri)
                .userNameAttributeName(IdTokenClaimNames.SUB)
                .clientName("GitHub")
                .build();
    }
}
