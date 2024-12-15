package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.model.dtos.UserLoginDto;
import com.merkury.vulcanus.model.dtos.UserPasswordResetDto;
import com.merkury.vulcanus.model.dtos.UserRegisterDto;
import com.merkury.vulcanus.exception.exceptions.EmailNotFoundException;
import com.merkury.vulcanus.exception.exceptions.EmailTakenException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.UsernameNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UsernameTakenException;
import com.merkury.vulcanus.exception.exceptions.PasswordResetTokenIsInvalidException;
import com.merkury.vulcanus.exception.exceptions.PasswordResetTokenNotFoundException;
import com.merkury.vulcanus.features.account.RestartPasswordService;
import com.merkury.vulcanus.features.account.AccountService;
import com.merkury.vulcanus.features.password.reset.PasswordResetTokenService;
import com.merkury.vulcanus.model.entities.PasswordResetToken;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.features.email.EmailService;
import com.merkury.vulcanus.observability.counter.invocations.InvocationsCounter;
import jakarta.servlet.http.HttpServletResponse;
import com.merkury.vulcanus.config.properties.UrlsProperties;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;

/**
 * <h1>We are using HS256 algorithm to sign the JWT token (for now).</h1>
 */
@Slf4j
@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
@InvocationsCounter
public class AccountController {

    private final AccountService accountService;
    private final EmailService emailService;
    private final UrlsProperties urlsProperties;
    private final String USER_REGISTERED_TITLE = "Register confirmation";
    private final String PASSWORD_RESET_TITLE = "Password reset";
    private final PasswordResetTokenService passwordResetTokenService;
    private final RestartPasswordService restartPasswordService;

    /**
     * @param userRegisterDto the user registration details containing:
     *                         <ul>
     *                          <li>email
     *                          <li>username
     *                          <li>password
     *                        </ul>
     * @return HTTP status 201 (Created) or 409 (Conflict) if the email or username is taken
     */

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegisterDto userRegisterDto, HttpServletResponse response) throws EmailTakenException, UsernameTakenException, InvalidCredentialsException {
        log.info("Start handling user registration...");
        accountService.registerUser(userRegisterDto);
        log.info("User registered successfully!");

        Map<String, Object> variables = emailService.createEmailVariables(userRegisterDto.username(), null);

        log.info("Sending email...");
        emailService.sendEmail(userRegisterDto.email(), USER_REGISTERED_TITLE, "registrationEmail", variables);

        var user = new UserLoginDto(userRegisterDto.username(), userRegisterDto.password());
        log.info("Start handling logging in user");
        accountService.loginUser(user, response);
        log.info("User logged in successfully!");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully");
    }

    /**
     * @param userLoginDto the user login details containing:
     *                     <ul>
     *                      <li>username
     *                      <li>password
     *                     </ul>
     * @return HTTP status 200 (OK) and the JWT tokens in the http only cookies
     * or 401 (Unauthorized) if the credentials are invalid
     */
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody UserLoginDto userLoginDto, HttpServletResponse response) throws InvalidCredentialsException {
        log.info("Start handling logging in user");
        accountService.loginUser(userLoginDto, response);
        log.info("User logged in successfully!");

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/login-success")
    public RedirectView loginSuccess(HttpServletResponse response, OAuth2AuthenticationToken oAuth2Token) throws EmailTakenException, UsernameTakenException, EmailNotFoundException, UsernameNotFoundException {
        log.info("Start handling oAuth2 user...");
        var loginResponseDto = accountService.handleOAuth2User(oAuth2Token, response);
        log.info("Successfully handled oAuth2 user!");

        var userEmail = loginResponseDto.userEmail();
        if (loginResponseDto.isUserRegistered()) {
            String username = restartPasswordService.getUserByEmail(userEmail).getUsername();
            Map<String, Object> variables = emailService.createEmailVariables(username, null);

            log.info("Sending email...");
            emailService.sendEmail(userEmail, USER_REGISTERED_TITLE, "registrationEmail", variables);
            log.info("Email sent successfully!");
        }

        var afterLoginPageUrl = urlsProperties.getAfterLoginPageUrl();
        log.info("User should be redirected");

        return new RedirectView(afterLoginPageUrl);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPasswordSendEmail(@RequestBody String email) {
        log.info("Start handling forgot password procedure...");
        UserEntity user = restartPasswordService.getUserByEmail(email);
        PasswordResetToken resetToken = passwordResetTokenService.changeToken(user);
        log.info("Procedure finished!");

        String resetLink = urlsProperties.getResetPasswordUrl() + resetToken.getToken().toString();

        Map<String, Object> variables = emailService.createEmailVariables(user.getUsername(), resetLink);

        log.info("Sending email...");
        emailService.sendEmail(email, PASSWORD_RESET_TITLE, "forgotPasswordEmail", variables);
        log.info("Email sent successfully!");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Password reset link sent to: " + email);
    }

    @PostMapping("/set-new-password")
    public ResponseEntity<String> setNewPassword(@Valid @RequestBody UserPasswordResetDto userPasswordResetDto) throws PasswordResetTokenIsInvalidException, PasswordResetTokenNotFoundException {
        log.info("Start restarting password...");
        accountService.restartUserPassword(userPasswordResetDto);
        log.info("Password restarted successfully!");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Password set successfully!");
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logoutUser() {
        log.info("Logging out user...");
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("User logged out successfully");
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("test");
    }
}