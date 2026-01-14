package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.user.UserLoginDto;
import com.merkury.vulcanus.model.dtos.user.UserPasswordResetDto;
import com.merkury.vulcanus.model.dtos.user.UserRegisterDto;
import com.merkury.vulcanus.features.account.RestartPasswordService;
import com.merkury.vulcanus.features.account.AccountService;
import com.merkury.vulcanus.features.password.reset.PasswordResetTokenService;
import com.merkury.vulcanus.model.entities.PasswordResetToken;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.features.email.EmailService;
import com.merkury.vulcanus.model.enums.EmailTemplate;
import com.merkury.vulcanus.model.enums.EmailTitle;
import com.merkury.vulcanus.model.enums.EmailVariable;
import com.merkury.vulcanus.model.dtos.EmailDto;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import com.merkury.vulcanus.config.properties.UrlsProperties;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

/**
 * <h1>We are using HS256 algorithm to sign the JWT token (for now).</h1>
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class AccountController {
    @Value("${email.sending.enabled}")
    private boolean isEmailSendingEnabled;
    private final AccountService accountService;
    private final EmailService emailService;
    private final UrlsProperties urlsProperties;
    private final PasswordResetTokenService passwordResetTokenService;
    private final RestartPasswordService restartPasswordService;
    private final CustomUserDetailsService customUserDetailsService;

    /**
     * @param userRegisterDto the user registration details containing:
     *                         <ul>
     *                          <li>email
     *                          <li>username
     *                          <li>password
     *                        </ul>
     * @return HTTP status 201 (Created) or 409 (Conflict) if the email or username is taken
     */

    @PostMapping("/public/account/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegisterDto userRegisterDto, HttpServletResponse response) throws EmailTakenException, UsernameTakenException, InvalidCredentialsException {
        log.info("Start handling user registration...");
        accountService.registerUser(userRegisterDto);
        log.info("User registered successfully!");

        if (isEmailSendingEnabled) {
            EmailDto emailDto = EmailDto.builder()
                    .receiver(userRegisterDto.email())
                    .title(EmailTitle.USER_REGISTERED.getTitle())
                    .template(EmailTemplate.REGISTRATION.getTemplateName())
                    .variables(Map.of(EmailVariable.USERNAME.getVariable(), userRegisterDto.username()))
                    .build();

            log.info("Sending email...");
            emailService.sendEmail(emailDto);
        }

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
    @PostMapping("/public/account/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody UserLoginDto userLoginDto, HttpServletResponse response) throws InvalidCredentialsException {
        log.info("Start handling logging in user");
        accountService.loginUser(userLoginDto, response);
        log.info("User logged in successfully!");

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/account/login-success")
    public RedirectView loginSuccess(HttpServletResponse response, OAuth2AuthenticationToken oAuth2Token) throws EmailTakenException, UsernameTakenException, EmailNotFoundException, UsernameNotFoundException, InvalidProviderException, UserNotFoundException {
        log.info("Start handling oAuth2 user...");
        var loginResponseDto = accountService.handleOAuth2User(oAuth2Token, response);
        log.info("Successfully handled oAuth2 user!");

        var userEmail = loginResponseDto.userEmail();
        if (isEmailSendingEnabled && loginResponseDto.isUserRegistered()) {
            String username = restartPasswordService.getUserByEmail(userEmail).getUsername();

            EmailDto emailDto = EmailDto.builder()
                    .receiver(userEmail)
                    .title(EmailTitle.USER_REGISTERED.getTitle())
                    .template(EmailTemplate.REGISTRATION.getTemplateName())
                    .variables(Map.of(EmailVariable.USERNAME.getVariable(), username))
                    .build();

            log.info("Sending email...");
            emailService.sendEmail(emailDto);
        }

        var afterLoginPageUrl = urlsProperties.getAfterLoginPageUrl();
        log.info("User should be redirected");

        return new RedirectView(afterLoginPageUrl);
    }

    @PostMapping("/public/account/forgot-password")
    public ResponseEntity<String> forgotPasswordSendEmail(@RequestBody String email) throws InvalidProviderException, UserNotFoundException {
        log.info("Start handling forgot password procedure...");
        UserEntity user = restartPasswordService.getUserByEmail(email);
        restartPasswordService.abortIfOauthUser(user);
        PasswordResetToken resetToken = passwordResetTokenService.changeToken(user);
        log.info("Procedure finished!");

        String resetLink = urlsProperties.getResetPasswordUrl() + resetToken.getToken().toString();

        EmailDto emailDto = EmailDto.builder()
                .receiver(email)
                .title(EmailTitle.PASSWORD_RESET.getTitle())
                .template(EmailTemplate.FORGOT_PASSWORD.getTemplateName())
                .variables(Map.of(EmailVariable.USERNAME.getVariable(), user.getUsername(), EmailVariable.RESET_LINK.getVariable(), resetLink))
                .build();

        log.info("Sending email...");
        emailService.sendEmail(emailDto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Password reset link sent to: " + email);
    }

    @PostMapping("/public/account/set-new-password")
    public ResponseEntity<String> setNewPassword(@Valid @RequestBody UserPasswordResetDto userPasswordResetDto) throws PasswordResetTokenIsInvalidException, PasswordResetTokenNotFoundException, UserNotFoundException {
        log.info("Start restarting password...");
        accountService.restartUserPassword(userPasswordResetDto);
        log.info("Password restarted successfully!");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Password set successfully!");
    }


    @GetMapping("/account/check")
    public ResponseEntity<String> checkIsAuthenticated() {
        return ResponseEntity.ok(customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername());
    }
}
