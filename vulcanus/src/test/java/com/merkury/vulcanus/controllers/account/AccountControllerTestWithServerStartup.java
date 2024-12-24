package com.merkury.vulcanus.controllers.account;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.merkury.vulcanus.model.dtos.UserLoginDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.UserRole;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
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
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        var user = UserEntity.builder()
                .username("test")
                .password("test")
                .userRole(UserRole.ROLE_USER)
                .build();

        userEntityRepository.deleteAll();
        userEntityRepository.save(user);
    }

    @Test
    void registerUser() {
    }

    @Test
    void loginUser() {
        setUp();
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
                () -> assertThat(setCookieHeader).contains("JWT_token")
        );
    }


    @Test
    void loginSuccess() {
    }

    @Test
    void forgotPasswordSendEmail() {
    }

    @Test
    void setNewPassword() {
    }

}