package com.merkury.vulcanus.controllers.account;

import com.merkury.vulcanus.model.dtos.user.UserLoginDto;
import com.merkury.vulcanus.model.dtos.user.UserRegisterDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.UserRole;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AccountControllerWithServerStartupTest {

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
    @DisplayName("Successful registration")
    void registerSuccess() {
        var registerDto = new UserRegisterDto("usegdrname1", "emafdil@example.com", "Passwds2@ord1");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegisterDto> request = new HttpEntity<>(registerDto, headers);

        var responseEntity = restTemplate.postForEntity(
                "http://localhost:" + port + "/public/account/register",
                request,
                String.class
        );

        assertAll(
                () -> assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatusCode.valueOf(201)),
                () -> assertThat(responseEntity.getBody()).isEqualTo("User registered successfully")
        );
    }

    @Test
    @DisplayName("Registration with taken username returns 409")
    void registerWithTakenUsernameReturns409() {
        var registerDto = new UserRegisterDto("test", "newemail@example.com", "Password123!");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegisterDto> request = new HttpEntity<>(registerDto, headers);

        var responseEntity = restTemplate.postForEntity(
                "http://localhost:" + port + "/public/account/register",
                request,
                String.class
        );

        assertAll(
                () -> assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatusCode.valueOf(409)),
                () -> assertThat(responseEntity.getBody()).contains("Username taken")
        );
    }

    @Test
    @DisplayName("Registration with invalid email format returns 422")
    void registerWithInvalidEmailFormatReturns400() {
        var registerDto = new UserRegisterDto("newuser", "invalid-email", "Password123!");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegisterDto> request = new HttpEntity<>(registerDto, headers);

        var responseEntity = restTemplate.postForEntity(
                "http://localhost:" + port + "/public/account/register",
                request,
                String.class
        );

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatusCode.valueOf(422));
    }

    @Test
    @DisplayName("Successful login")
    void loginSuccess() {
        UserLoginDto loginDto = new UserLoginDto("test", "test");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserLoginDto> request = new HttpEntity<>(loginDto, headers);

        var responseEntity = restTemplate.postForEntity(
                "http://localhost:" + port + "/public/account/login",
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
    @DisplayName("After successful login, the user can access the private endpoint")
    void loginSuccessGivesAccessToPrivateEndpoint() {
        UserLoginDto loginDto = new UserLoginDto("test", "test");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserLoginDto> request = new HttpEntity<>(loginDto, headers);

        var responseEntity = restTemplate.postForEntity(
                "http://localhost:" + port + "/public/account/login",
                request,
                String.class
        );

        var setCookieHeader = responseEntity.getHeaders().getFirst("Set-Cookie");
        headers = new HttpHeaders();
        headers.add("Cookie", setCookieHeader);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        var finalResponseEntity = restTemplate.exchange(
                "http://localhost:" + port + "/private/test",
                HttpMethod.GET,
                entity,
                String.class
        );

        assertAll(
                () -> assertThat(finalResponseEntity.getStatusCode()).isEqualTo(HttpStatusCode.valueOf(200)),
                () -> assertThat(finalResponseEntity.getBody()).contains("Private test endpoint says hello!")
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
