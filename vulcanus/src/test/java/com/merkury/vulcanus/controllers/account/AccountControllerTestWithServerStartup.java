package com.merkury.vulcanus.controllers.account;

import com.fasterxml.jackson.databind.ObjectMapper;
//import com.merkury.vulcanus.config.TestRestTemplateConfig;
import com.merkury.vulcanus.model.dtos.UserLoginDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.UserRole;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AccountControllerTestWithServerStartup {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserEntityRepository userEntityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    void registerUser() {
    }

    @Test
    @DisplayName("Login with valid credentials")
    void loginSuccess() {
        UserLoginDto loginDto = new UserLoginDto("test", "test");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserLoginDto> request = new HttpEntity<>(loginDto, headers);

        var responseEntity = restTemplate.postForEntity(
                "http://localhost:" + port + "/account/login",
                request,
                String.class
        );

        var setCookieHeader = responseEntity.getHeaders().getFirst("Set-Cookie");
        assertAll(
                () -> assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatusCode.valueOf(200)),
                () -> assertThat(setCookieHeader).isNotNull(),
                () -> assertThat(setCookieHeader).contains("JWT_token"),
                () -> assertThat(setCookieHeader).contains("HttpOnly"),
                () -> {
                    // 1. Define the prefix
                    String prefix = "JWT_token=";
                    int startIndex = setCookieHeader.indexOf(prefix);
                    startIndex += prefix.length();

                    // 2. Find the semicolon (or the end of the string) as the end of the token value
                    int endIndex = setCookieHeader.indexOf(';', startIndex);
                    if (endIndex == -1) {
                        endIndex = setCookieHeader.length();
                    }

                    // 3. Extract the actual token
                    String jwtToken = setCookieHeader.substring(startIndex, endIndex);

                    // 4. Check the length; it can vary depending on encoded claims
                    assertThat(jwtToken.length()).isGreaterThan(30);
                }
        );
    }

    @Test
    @DisplayName("Login with invalid credentials returns 401")
    void loginWithInvalidCredentialsReturns401() {
        UserLoginDto loginDto = new UserLoginDto("invalidUser", "wrongPassword");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        var request = new HttpEntity<>(loginDto, headers);

        var responseEntity = restTemplate.postForEntity(
                "http://localhost:" + port + "/account/login",
                request,
                String.class
        );
        assertAll(
                () -> assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatusCode.valueOf(401)),
                () -> assertThat(responseEntity.getHeaders().get("Set-Cookie")).isNull()
        );

    }

}