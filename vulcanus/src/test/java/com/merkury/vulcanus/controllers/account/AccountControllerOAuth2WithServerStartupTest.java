package com.merkury.vulcanus.controllers.account;

import com.merkury.vulcanus.exception.exceptions.InvalidProviderException;
import com.merkury.vulcanus.features.account.AccountService;
import com.merkury.vulcanus.model.dtos.OAuth2LoginResponseDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.UserRole;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class AccountControllerOAuth2WithServerStartupTest {
    @LocalServerPort
    private int port;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserEntityRepository userEntityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockBean
    private AccountService accountService;

    @BeforeEach
    void setUp() {
        var user = UserEntity.builder()
                .username("test")
                .password(passwordEncoder.encode("test"))
                .userRole(UserRole.ROLE_USER)
                .build();

        userEntityRepository.deleteAll();
        userEntityRepository.save(user);
    }

    @Test
    @DisplayName("Registration of oauth2 user with invalid provider returns 422")
    void registerOauth2UserWithInvalidProviderReturns422() throws Exception {
        Map<String, Object> attributes = Map.of(
                "email", "test@example.com",
                "login", "testuser"
        );
        DefaultOAuth2User oAuth2User = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "login"
        );

        OAuth2AuthenticationToken oAuth2Token =
                new OAuth2AuthenticationToken(oAuth2User, oAuth2User.getAuthorities(), "github");

        doThrow(new InvalidProviderException("Invalid provider: invalid"))
                .when(accountService)
                .handleOAuth2User(any(OAuth2AuthenticationToken.class), any(HttpServletResponse.class));

        mockMvc.perform(get("http://localhost:" + port + "/account/login-success")
                        .with(authentication(oAuth2Token)))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @DisplayName("Registration of oauth2 user with valid provider returns 302")
    void registerOauth2UserWithValidProviderReturns302() throws Exception {
        Map<String, Object> attributes = Map.of(
                "email", "test@example.com",
                "login", "testuser"
        );
        DefaultOAuth2User oAuth2User = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "login"
        );

        OAuth2AuthenticationToken oAuth2Token =
                new OAuth2AuthenticationToken(oAuth2User, oAuth2User.getAuthorities(), "github");

        when(accountService.handleOAuth2User(any(OAuth2AuthenticationToken.class), any(HttpServletResponse.class)))
                .thenReturn(new OAuth2LoginResponseDto(attributes.get("email").toString(), false));

        mockMvc.perform(get("http://localhost:" + port + "/account/login-success")
                        .with(authentication(oAuth2Token)))
                .andExpect(status().isFound());
    }
}
